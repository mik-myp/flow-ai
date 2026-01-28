"use client";
import { Drawer, Form, Input, Select } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import type { Edge, Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";

import { X } from "lucide-react";
import { BaseNodeData, TNode } from "@/types/flows";
import EmEmoji from "@/components/emoji/EmEmoji";
import { nodeMeta } from "@/lib/workflows";

type NodeFormValues = NonNullable<BaseNodeData>;
type NodeSettingsValues = Record<string, object | undefined>;
type NodeSettingSchema = NonNullable<NodeFormValues["settingSchema"]>;
type NodeSettingField = NodeSettingSchema["fields"][number];

type NodeSettingsDrawerProps = {
  node: TNode | null;
  open: boolean;
  onClose: () => void;
  onUpdateNodeData: (nodeId: string, data: Partial<NodeFormValues>) => void;
};

const NodeSettingsDrawer = ({
  node,
  open,
  onClose,
  onUpdateNodeData,
}: NodeSettingsDrawerProps) => {
  const { updateNodeData } = useReactFlow<Node, Edge>();
  const [form] = Form.useForm<NodeSettingsValues>();

  const modelOptions = [];

  const nodeData = useMemo(() => {
    return {
      icon: node?.originIcon ?? "",
      title: node?.data?.title ?? node?.originTitle ?? "",
      description: node?.data?.description ?? "",
    };
  }, [node]);

  const settingFields = useMemo<NodeSettingField[]>(() => {
    const schema = node?.data?.settingSchema?.fields;
    if (schema?.length) {
      return schema;
    }
    if (node?.type) {
      const meta = nodeMeta[node.type as keyof typeof nodeMeta];
      return meta?.data.settingSchema?.fields ?? [];
    }
    return [];
  }, [node]);
  const settings = useMemo<NodeSettingsValues>(
    () => (node?.data?.settings ?? {}) as NodeSettingsValues,
    [node],
  );

  useEffect(() => {
    if (!node) {
      form.resetFields();
      return;
    }
    form.setFieldsValue(settings);
  }, [form, node, settings]);

  const handleUpdate = useCallback(
    (patch: Partial<NodeFormValues>) => {
      if (!node) {
        return;
      }
      updateNodeData(node.id, (node) => ({
        nodeData: {
          ...node.data,
          ...patch,
        },
      }));
      onUpdateNodeData(node.id, patch);
    },
    [node, updateNodeData, onUpdateNodeData],
  );

  const handleSettingsChange = useCallback(
    (_: Partial<NodeSettingsValues>, allValues: NodeSettingsValues) => {
      if (!node) {
        return;
      }
      handleUpdate({ settings: allValues });
    },
    [handleUpdate, node],
  );

  const renderSettingField = useCallback(
    (field: NodeSettingField) => {
      if (field.type === "select") {
        const options =
          field.optionsSource === "models"
            ? modelOptions
            : (field.options ?? []);
        return (
          <Select
            placeholder={field.placeholder}
            options={options}
            allowClear={!field.required}
          />
        );
      }
      if (field.type === "textarea") {
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            autoSize={{ maxRows: 6 }}
          />
        );
      }
      if (field.type === "input") {
        return <Input placeholder={field.placeholder} />;
      }
      return null;
    },
    [modelOptions],
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
  }, [onClose, handleUpdate, nodeData]);

  return (
    <Drawer
      title={title}
      closable={false}
      open={open}
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
    >
      {settingFields.length ? (
        <div className="mb-4">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleSettingsChange}
          >
            {settingFields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                extra={field.extra}
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

export default NodeSettingsDrawer;
