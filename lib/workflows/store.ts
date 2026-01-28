import type { IWorkFlow, IWorkFlowState } from "@/types/workflow";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { create } from "zustand";
import { nodeMeta } from "./constant";
import { v4 as uuidv4 } from "uuid";

const useWorkFlow = create<IWorkFlowState>((set, get) => ({
  workflowId: null,
  workflow: {},
  edges: [],
  nodes: [],

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

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
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
