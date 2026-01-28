import { IWorkFlow, IWorkFlowState } from "@/types/workflow";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { create } from "zustand";
import { nodeMeta } from "./constant";
import { v4 as uuidv4 } from "uuid";

const useWorkFlow = create<IWorkFlowState>((set, get) => ({
  workflowId: null,
  workflow: {},
  edges: [],
  nodes: [],

  isPreview: false,

  previewNode: {
    id: "preview-node",
    type: "",
    position: { x: 0, y: 0 },
    data: {},
  },

  // 初始化工作流数据
  initWorkflow: (
    workflowId: string,
    workflow: IWorkFlow,
    nodes: Node[],
    edges: Edge[],
  ) => {
    set({
      workflowId,
      workflow,
      nodes,
      edges,
    });
  },

  addNode(node: Node) {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  onNodesChange: (changes: NodeChange<Node>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange<Edge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  startAddPreviewNode: (type: string) => {
    set({
      isPreview: true,
      previewNode: {
        ...get().previewNode,
        type,
      },
    });
  },

  updatePreviewPosition: (position: { x: number; y: number } | null) => {
    set({
      previewNode: {
        ...get().previewNode,
        position: position ?? { x: 0, y: 0 },
      },
    });
  },

  stopAddPreviewNode: (type: "place" | "cancel") => {
    if (type === "place") {
      get().addNode({
        ...get().previewNode,
        ...nodeMeta[get().previewNode.type],
        id: uuidv4(),
      });
    }
    set({
      isPreview: false,
      previewNode: {
        id: "preview-node",
        type: "previewNode",
        position: { x: 0, y: 0 },
        data: {},
      },
    });
  },

  // 清空工作流数据
  clearWorkflow: () => {
    set({
      workflowId: null,
      workflow: {},
      nodes: [],
      edges: [],
    });
  },
}));

export default useWorkFlow;
