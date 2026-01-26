"use client";

import { Button, Form, Input, message, Select, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import ModalForm, { ModalFormItem } from "@/components/ModalForm";
import { IModel, ModelProvider } from "@/types/model";
import React from "react";
import { createClient } from "@/lib/supabase/client";

type ModelFormValues = Partial<
  Pick<IModel, "apiKey" | "baseURL" | "model" | "name" | "provider">
>;

type ModelModalProps = {
  model?:
    | (ModelFormValues & {
        id: string;
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
    children: <Input placeholder="例如：默认模型" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入名称",
      },
    ],
  },
  {
    name: "provider",
    label: "提供商",
    children: <Select options={providerOptions} placeholder="请选择提供商" />,
    initialValue: "openai",
    required: true,
    rules: [
      {
        required: true,
        message: "请选择提供商",
      },
    ],
  },
  {
    name: "model",
    label: "模型名称",
    children: <Input placeholder="例如：gpt-4o-mini / claude-3-5-sonnet" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入模型名称",
      },
    ],
  },
  {
    name: "apiKey",
    label: "密钥",
    children: <Input.Password placeholder="xxxxxx" />,
    required: true,
    rules: [
      {
        required: true,
        message: "请输入密钥",
      },
    ],
  },
  {
    name: "baseURL",
    label: "API 基础 URL",
    children: <Input placeholder="https://api.openai.com/v1" />,
    extra: "用于 OpenAI 兼容提供商，可选",
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

  const title = model ? "创建模型" : "编辑模型";

  const mode = model ? "edit" : "create";

  const modelId = model?.id;

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
    router.refresh();
  };

  React.useEffect(() => {
    if (expectedPath && pathname === expectedPath) {
      setOpen(true);
    }
  }, [expectedPath, pathname]);

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
          user_id: user!.id,
        });

        if (error) {
          throw error;
        }

        message.success("模型创建成功.");
      } else {
        if (!model) {
          message.error("缺少模型ID");
          return;
        }

        const { error } = await supabase
          .from("model")
          .update({
            name: values.name,
            provider: values.provider,
            model: values.model,
            baseURL: values.baseURL,
            updated_at: new Date().toISOString(),
          })
          .eq("id", modelId);

        if (error) {
          throw error;
        }

        message.success("模型更新成功.");
      }

      setOpen(false);
    } catch {
      message.error("模型更新失败.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTest = async () => {
    const validate = await form.validateFields();

    if (validate) {
      const { baseURL, model, provider, apiKey } = validate;

      try {
        setTestStatus(TestStatus.Processing);
        const res = await fetch("/ai/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider,
            model,
            apiKey,
            baseURL,
          }),
        });

        // if (aiMsg.content) {
        //   setTestStatus(TestStatus.Success);
        //   message.success("测试成功");
        // }
      } catch (error) {
        message.error(
          "测试失败" + (error instanceof Error ? "：" + error.message : ""),
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
        initialValues: model ?? {},
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
