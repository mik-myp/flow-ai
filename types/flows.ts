import type { Node } from "@xyflow/react";

export type FlowNodeType = "start" | "end" | "llm" | "prompt" | "userInput";

export type NodeSettingFieldType = "input" | "textarea" | "select";

export type NodeSettingFieldOption = {
  label: string;
  value: string;
};

export type NodeSettingFieldSchema = {
  name: string;
  label: string;
  type: NodeSettingFieldType;
  placeholder?: string;
  required?: boolean;
  extra?: string;
  options?: NodeSettingFieldOption[];
  optionsSource?: "models";
};

export type TSettingSchema = {
  fields: NodeSettingFieldSchema[];
};

/** 基础节点数据类型 */
export interface BaseNodeData extends Record<string, unknown> {
  title?: string;
  description?: string;
  settingSchema?: TSettingSchema;
  settings?: Record<string, unknown>;
}
export type TNode = Omit<Node<BaseNodeData, FlowNodeType>, "position"> & {
  originIcon: string;
  originTitle: string;
  originDescription: string;
  showTarget?: boolean;
  showSource?: boolean;
};

export type NodeCatalogItem = Omit<
  Node<BaseNodeData, FlowNodeType>,
  "position"
> & {
  type: FlowNodeType;
} & TNode;
