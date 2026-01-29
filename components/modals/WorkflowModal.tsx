"use client";

import * as React from "react";
import { Form, Input, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import ModalForm, { ModalFormItem } from "@/components/ModalForm";
import { createClient } from "@/lib/supabase/client";
import type { IWorkFlow } from "@/types/workflow";
import EmojiPick from "@/components/emoji/EmojiPick";

type WorkflowFormValues = Partial<
  Pick<IWorkFlow, "icon" | "name" | "description">
>;

type WorkflowModalProps = {
  workflow?:
    | (WorkflowFormValues & {
        id: string;
      })
    | null;
};

const workflowFormItems: ModalFormItem[] = [
  {
    name: "icon",
    label: "图标",
    children: <EmojiPick />,
  },
  {
    name: "name",
    label: "工作流名称",
    rules: [{ required: true, message: "请输入工作流名称。" }],
    children: <Input placeholder="例如：客服分流" />,
  },
  {
    name: "description",
    label: "描述",
    children: <Input.TextArea rows={4} placeholder="描述该工作流的用途。" />,
  },
];

export default function WorkflowModal({ workflow }: WorkflowModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm<WorkflowFormValues>();

  const [open, setOpen] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const mode = workflow ? "edit" : "create";
  const workflowId = workflow?.id;

  const title = workflow ? "编辑工作流" : "创建工作流";

  const supabase = React.useMemo(() => createClient(), []);

  const expectedPath =
    mode === "create"
      ? "/workflows/new"
      : workflowId
        ? `/workflows/${workflowId}/edit`
        : "";

  const handleClose = () => {
    setOpen(false);
  };

  const handleAfterClose = () => {
    router.push("/workflows");
  };

  React.useEffect(() => {
    if (expectedPath && pathname === expectedPath) {
      setOpen(true);
    }
  }, [expectedPath, pathname]);

  const handleSubmit = async (values: WorkflowFormValues) => {
    setSubmitting(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        message.error("用户未登录。");
        return;
      }

      if (mode === "create") {
        const { error } = await supabase.from("work_flow").insert({
          icon: values.icon,
          name: values.name,
          description: values.description,
          tags: [],
          user_id: user.id,
        });

        if (error) {
          throw error;
        }

        message.success("工作流已创建。");
      } else {
        if (!workflowId) {
          message.error("缺少工作流 ID。");
          return;
        }

        const { error } = await supabase
          .from("work_flow")
          .update({
            icon: values.icon,
            name: values.name,
            description: values.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", workflowId);

        if (error) {
          throw error;
        }

        message.success("工作流已更新。");
      }

      setOpen(false);
      router.refresh();
    } catch {
      message.error("工作流更新失败。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalForm
      open={open}
      title={title}
      formItems={workflowFormItems}
      onCancel={handleClose}
      onFinish={handleSubmit}
      form={form}
      resetOnClose
      formProps={{
        disabled: submitting,
        initialValues: workflow ?? { icon: "face_in_clouds" },
      }}
      modalProps={{
        destroyOnHidden: true,
        confirmLoading: submitting,
        afterClose: handleAfterClose,
      }}
    />
  );
}
