"use client";
import { Drawer, Form, Input, Select, type SelectProps } from "antd";
import { memo, useCallback, useEffect, useMemo } from "react";

import { X } from "lucide-react";
import EmEmoji from "@/components/emoji/EmEmoji";
import { nodeMeta } from "@/lib/workflows/constant";
import { BaseNodeData, FlowNodeType, TNode } from "@/types/workflow";
import { useModels } from "@/lib/hooks/useModels";
import { IModel } from "@/types/model";

type NodeSettingsDrawerProps = {
  node: TNode<BaseNodeData> | undefined;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Partial<BaseNodeData>) => void;
};

const NodeSettingsDrawer = ({
  node,
  onClose,
  onUpdateNode,
}: NodeSettingsDrawerProps) => {
  const { data: models, isLoading: modelsLoading } = useModels<IModel[]>();

  type NodeSettingFormValues = NonNullable<BaseNodeData["settingData"]>;
  const [form] = Form.useForm<NodeSettingFormValues>();

  const settingFields = useMemo(() => {
    if (!node?.type) return [];

    return nodeMeta[node.type as FlowNodeType]?.meta.settingFields ?? [];
  }, [node]);

  const nodeData = useMemo(() => {
    if (!node?.type) {
      return {
        icon: "",
        title: "",
        description: "",
        settingData: {},
      };
    }

    const { meta } = nodeMeta[node.type as FlowNodeType];

    return {
      icon: meta?.icon ?? "",
      title: node.data.title ?? meta.title,
      description: node.data.description ?? "",
      settingData: node?.data?.settingData ?? {},
    };
  }, [node]);

  const handleUpdate = useCallback(
    (data: Partial<BaseNodeData>) => {
      if (!node) {
        return;
      }
      onUpdateNode(node.id, data);
    },
    [node, onUpdateNode],
  );

  const renderSettingField = useCallback(
    (field: {
      name: string;
      type: string;
      required?: boolean;
      optionsSource?: string;
      options?: Array<{ label: string; value: string }>;
      fieldNames?: SelectProps["fieldNames"];
    }) => {
      if (field.type === "select") {
        let selectOptions: SelectProps["options"] = field.options ?? [];

        if (field.optionsSource === "models") {
          selectOptions = models ? models : [];
        }

        return (
          <Select
            options={selectOptions}
            allowClear={!field.required}
            fieldNames={field.fieldNames}
            loading={modelsLoading}
            labelInValue
          />
        );
      }
      if (field.type === "textarea") {
        return <Input.TextArea autoSize={{ maxRows: 6 }} />;
      }
      if (field.type === "input") {
        return <Input />;
      }
      return null;
    },
    [models, modelsLoading],
  );

  const title = useMemo(() => {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            <span className="relative flex h-6 w-6 shrink-0 grow-0 items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-[#10182814] text-[14px]">
              <EmEmoji id={nodeData.icon} />
            </span>
            <Input
              type="text"
              style={{ width: "100%" }}
              className="font-semibold focus-within:border-[#3b82f6]! focus:border-[#3b82f6]!"
              value={nodeData.title}
              size="small"
              styles={{
                root: {
                  border: "1px solid transparent",
                  backgroundColor: "none",
                },
              }}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div
            className="ml-6 flex cursor-pointer items-center"
            onClick={onClose}
          >
            <X size={16} />
          </div>
        </div>
        <div className="text-[12px] leading-4 font-normal">
          <Input.TextArea
            className="h-8 max-h-8 min-h-8 overflow-y-hidden border-white"
            value={nodeData.description}
            styles={{
              root: {
                marginTop: 12,
                resize: "none",
                border: "1px solid transparent",
                backgroundColor: "none",
              },
            }}
            classNames={{
              textarea:
                "focus-within:border-[#3b82f6]! focus:border-[#3b82f6]!",
            }}
            placeholder="添加描述..."
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </div>
      </>
    );
  }, [
    nodeData.icon,
    nodeData.title,
    nodeData.description,
    onClose,
    handleUpdate,
  ]);

  useEffect(() => {
    form.setFieldsValue(nodeData.settingData);
    return () => {
      form.resetFields();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id]);

  if (!node) return null;

  return (
    <Drawer
      title={title}
      closable={false}
      open={Boolean(node)}
      placement="right"
      size={400}
      onClose={onClose}
      mask={false}
      getContainer={false}
      rootStyle={{ position: "absolute" }}
      styles={{
        root: { overflowX: "hidden" },
        wrapper: {
          maxWidth: "100%",
          top: 66,
          bottom: 14,
          right: 12,
          borderRadius: 20,
        },
        section: { borderRadius: 20 },
        header: {
          padding: "16px 16px 12px",
          borderBottom: "none",
        },
        title: {
          width: "100%",
        },
        body: {
          padding: "12px 16px",
        },
      }}
      destroyOnHidden
      loading={modelsLoading}
    >
      {settingFields.length ? (
        <div className="mb-4">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={(_, values) => {
              console.log(
                "🚀 ~ index.tsx:213 ~ NodeSettingsDrawer ~ values:",
                values,
              );

              handleUpdate({
                settingData: values,
              });
            }}
          >
            {settingFields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={
                  field.required
                    ? [{ required: true, message: `请填写${field.label}` }]
                    : undefined
                }
              >
                {renderSettingField(field)}
              </Form.Item>
            ))}
          </Form>
        </div>
      ) : null}
    </Drawer>
  );
};

export default memo(NodeSettingsDrawer);
