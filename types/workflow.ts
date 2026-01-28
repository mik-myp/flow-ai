import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";

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

export interface IWorkFlowState {
  workflowId: string | null;
  workflow: IWorkFlow | object;
  nodes: Node[];
  edges: Edge[];

  isPreview: boolean;

  previewNode: {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  };

  // 初始化方法
  initWorkflow: (
    workflowId: string,
    workflow: IWorkFlow,
    nodes: Node[],
    edges: Edge[],
  ) => void;

  // 节点操作方法
  addNode: (node: Node) => void;
  onNodesChange: (changes: NodeChange<Node>[]) => void;

  // 边操作方法
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;

  onConnect: (connection: Connection) => void;

  startAddPreviewNode: (type: string) => void;

  updatePreviewPosition: (position: { x: number; y: number } | null) => void;

  stopAddPreviewNode: (type: "place" | "cancel") => void;

  // 清空方法
  clearWorkflow: () => void;
}
