import type {
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";

/**
 * 工作流基本信息
 */
export interface IWorkFlow {
  id: string;
  created_at: string;
  icon: string;
  name: string;
  description: string;
  updated_at: string;
  tags: string[] | null;
  user_id: string;
}

/**
 * 工作流状态管理接口
 * 使用 @xyflow/react 提供的标准类型
 */
export interface IWorkFlowState {
  // 状态数据
  workflowId: string | null;
  workflow: IWorkFlow | Record<string, never>;
  nodes: Node[];
  edges: Edge[];

  // 初始化方法
  initWorkflow: (
    workflowId: string,
    workflow: IWorkFlow,
    nodes: Node[],
    edges: Edge[],
  ) => void;

  // 节点操作方法
  addNode: (node: Node) => void;
  onNodesChange: OnNodesChange;

  // 边操作方法
  onEdgesChange: OnEdgesChange;

  // 连接方法
  onConnect: (connection: Connection) => void;

  // 清空方法
  clearWorkflow: () => void;
}

/** 自定义节点类型 */
export type FlowNodeType = "textInput" | "generateText" | "generateImage";

/** 基础节点数据类型 */

export interface BaseNodeData extends Record<string, unknown> {
  title: string;
  description?: string;
  settingData?: {
    input?: string;
    textModel?: string;
    imageModel?: string;
  };
}
