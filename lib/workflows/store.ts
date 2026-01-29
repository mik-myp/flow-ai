import type { IWorkFlow, IWorkFlowState, TEdge, TNode } from "@/types/workflow";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";

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
    const now = new Date().toISOString();
    set({
      workflowId,
      workflow,
      nodes: nodes.map((node) => ({
        ...node,
        updated_at: (node as TNode).updated_at ?? now,
      })) as TNode[],
      edges: edges.map((edge) => ({
        ...edge,
        updated_at: (edge as TEdge).updated_at ?? now,
      })) as TEdge[],
    });
  },

  addNode(node: Node) {
    set((state) => ({
      nodes: [
        ...state.nodes,
        { ...node, updated_at: new Date().toISOString() } as TNode,
      ],
    }));
  },

  deleteNode(nodeId: string) {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    }));
  },

  onNodesChange: (changes: NodeChange<TNode>[]) => {
    set((state) => {
      const nextNodes = applyNodeChanges<TNode>(changes, state.nodes);
      const shouldStamp = changes.some(
        (change) => change.type !== "position" || change.dragging === false,
      );
      if (!shouldStamp) {
        return { nodes: nextNodes };
      }

      const now = new Date().toISOString();
      const changedIds = new Set(
        changes.flatMap((change) => {
          if ("id" in change) {
            return [change.id];
          }
          if ("item" in change) {
            return [change.item.id];
          }
          return [];
        }),
      );
      return {
        nodes: nextNodes.map((node) =>
          changedIds.has(node.id) ? { ...node, updated_at: now } : node,
        ),
      };
    });
  },

  onEdgesChange: (changes: EdgeChange<TEdge>[]) => {
    set((state) => {
      const nextEdges = applyEdgeChanges<TEdge>(changes, state.edges);
      if (!changes.length) {
        return { edges: nextEdges };
      }

      const now = new Date().toISOString();
      const changedIds = new Set(
        changes.flatMap((change) => {
          if ("id" in change) {
            return [change.id];
          }
          if ("item" in change) {
            return [change.item.id];
          }
          return [];
        }),
      );
      return {
        edges: nextEdges.map((edge) =>
          changedIds.has(edge.id) ? { ...edge, updated_at: now } : edge,
        ),
      };
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge<
        TEdge & {
          updated_at: string;
        }
      >(
        {
          ...connection,
          updated_at: new Date().toISOString(),
        },
        get().edges,
      ),
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
