"use client";

import { Button, Form, Input, message, Select, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import ModalForm, { ModalFormItem } from "@/components/ModalForm";
import { IModel, ModelProvider } from "@/types/model";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import {
  getModelApiKey,
  saveModelApiKey,
} from "@/lib/indexeddb/model-api-keys";

type ModelFormValues = Partial<
  Pick<IModel, "apiKey" | "baseURL" | "model" | "name" | "provider">
>;

type ModelModalProps = {
  model?:
    | (ModelFormValues & {
        id: string;
        indexedDB_id?: string | null;
      })
    | null;
};

const providerOptions: { label: string; value: ModelProvider }[] = [
  { label: "AI Gateway", value: "ai-gateway" },
  // { label: "OpenAI", value: "openai" },
  // { label: "Anthropic", value: "anthropic" },
  // { label: "Google GenAI", value: "google-genai" },
  // { label: "OpenAI 兼容", value: "openai-compatible" },
];

const TestStatus = {
  Success: "success",
  Error: "error",
  Processing: "processing",
  Default: "default",
} as const;

type TestStatusKey = keyof typeof TestStatus;
type TestStatusValue = (typeof TestStatus)[TestStatusKey];

const TestStatusLabels: Record<TestStatusValue, string> = {
  [TestStatus.Success]: "测试成功",
  [TestStatus.Error]: "测试失败",
  [TestStatus.Processing]: "测试中",
  [TestStatus.Default]: "未测试",
};

const modelFormItems: ModalFormItem[] = [
  {
    name: "name",
    label: "名称",
    children: <Input placeholder="例如：默认 GPT-4o" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入名称。",
      },
    ],
  },
  {
    name: "provider",
    label: "供应商",
    children: <Select options={providerOptions} placeholder="选择供应商" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请选择供应商。",
      },
    ],
  },
  {
    name: "model",
    label: "模型名称",
    children: <Input placeholder="例如：gpt-4o-mini 或 claude-3-5-sonnet" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入模型名称。",
      },
    ],
  },
  {
    name: "apiKey",
    label: "API 密钥",
    children: <Input.Password placeholder="sk-..." />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入 API 密钥。",
      },
    ],
  },
  {
    name: "baseURL",
    label: "基础 URL",
    children: <Input placeholder="https://api.openai.com/v1" />,
    extra: "兼容供应商可选填。",
  },
];

export default function ModelModal({ model }: ModelModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [form] = Form.useForm<ModelFormValues>();
  const [open, setOpen] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<TestStatusValue>(
    TestStatus.Default,
  );

  const title = model ? "编辑模型" : "添加模型";
  const mode = model ? "edit" : "create";
  const modelId = model?.id;

  const indexedDbIdRef = React.useRef<string | null>(
    mode === "create" ? uuidv4() : (model?.indexedDB_id ?? uuidv4()),
  );

  const supabase = React.useMemo(() => createClient(), []);

  const expectedPath =
    mode === "create"
      ? "/models/new"
      : modelId
        ? `/models/${modelId}/edit`
        : "";

  const handleClose = () => {
    setTestStatus(TestStatus.Default);
    setOpen(false);
  };

  const handleAfterClose = () => {
    router.push("/models");
  };

  React.useEffect(() => {
    if (expectedPath && pathname === expectedPath) {
      setOpen(true);
    }
  }, [expectedPath, pathname]);

  React.useEffect(() => {
    if (!open || mode !== "edit") {
      return;
    }

    const indexedDBId = model?.indexedDB_id ?? indexedDbIdRef.current;
    if (!indexedDBId) {
      form.setFieldsValue({ apiKey: null });
      return;
    }

    let isActive = true;

    const loadApiKey = async () => {
      try {
        const apiKey = await getModelApiKey(indexedDBId);
        if (isActive && !form.isFieldTouched("apiKey")) {
          form.setFieldsValue({ apiKey: apiKey ?? null });
        }
      } catch {
        if (isActive && !form.isFieldTouched("apiKey")) {
          form.setFieldsValue({ apiKey: null });
        }
      }
    };

    loadApiKey();

    return () => {
      isActive = false;
    };
  }, [form, mode, model?.indexedDB_id, open]);

  const handleSubmit = async (values: ModelFormValues) => {
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      if (mode === "create") {
        const { error } = await supabase.from("model").insert({
          name: values.name,
          provider: values.provider,
          model: values.model,
          baseURL: values.baseURL,
          indexedDB_id: indexedDbIdRef.current,
          user_id: user!.id,
        });

        if (error) {
          throw error;
        }

        try {
          if (indexedDbIdRef.current && values.apiKey) {
            await saveModelApiKey(indexedDbIdRef.current, values.apiKey);
          }
        } catch (error) {
          console.warn("在IndexedDB中存储模型apiKey失败", error);
        }

        message.success("模型已创建。");
      } else {
        if (!model) {
          message.error("缺少模型 ID。");
          return;
        }

        const updatePayload: Record<string, unknown> = {
          name: values.name,
          provider: values.provider,
          model: values.model,
          baseURL: values.baseURL,
          updated_at: new Date().toISOString(),
        };

        if (!model.indexedDB_id && indexedDbIdRef.current) {
          updatePayload.indexedDB_id = indexedDbIdRef.current;
        }

        const { error } = await supabase
          .from("model")
          .update(updatePayload)
          .eq("id", modelId);

        if (error) {
          throw error;
        }

        try {
          if (indexedDbIdRef.current && values.apiKey) {
            await saveModelApiKey(indexedDbIdRef.current, values.apiKey);
          }
        } catch (error) {
          console.warn("Failed to store model apiKey in IndexedDB", error);
        }

        message.success("模型已更新。");
      }

      router.refresh();
      setOpen(false);
    } catch {
      message.error("模型更新失败。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTest = async () => {
    const validate = await form.validateFields();

    if (validate) {
      const { baseURL, model: modelName, provider, apiKey } = validate;

      try {
        setTestStatus(TestStatus.Processing);
        const res = await fetch("/ai/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider,
            model: modelName,
            apiKey,
            baseURL,
          }),
        });
        if (!res.ok) {
          throw new Error("请求失败");
        }
        setTestStatus(TestStatus.Success);
        message.success("测试成功。");
      } catch (error) {
        message.error(
          "测试失败。" + (error instanceof Error ? ` ${error.message}` : ""),
        );
        setTestStatus(TestStatus.Error);
      }
    }
  };

  return (
    <ModalForm
      open={open}
      title={
        <div className="flex items-center gap-2">
          <div>{title}</div>
          <Tag color={testStatus}>{TestStatusLabels[testStatus]}</Tag>
        </div>
      }
      formItems={modelFormItems}
      onCancel={handleClose}
      onFinish={handleSubmit}
      form={form}
      resetOnClose
      formProps={{
        disabled: submitting,
        initialValues: { provider: "ai-gateway", ...(model ?? {}) },
      }}
      modalProps={{
        destroyOnHidden: true,
        confirmLoading: submitting,
        afterClose: handleAfterClose,
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button onClick={handleTest} loading={testStatus === "processing"}>
              测试
            </Button>
            <OkBtn />
          </>
        ),
      }}
    />
  );
}
