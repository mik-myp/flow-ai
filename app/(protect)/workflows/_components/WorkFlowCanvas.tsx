"use client";

import FlowControls from "@/components/flows/FlowControls";
import { edgeTypes, nodeTypes } from "@/lib/workflows";
import useWorkFlow from "@/lib/workflows/store";
import { IWorkFlow } from "@/types/workflow";
import {
  Background,
  Edge,
  Node,
  ReactFlow,
  ReactFlowInstance,
  useReactFlow,
} from "@xyflow/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

const WorkFlowCanvas = ({
  workflowId,
  workflowDetail,
}: {
  workflowId: string;
  workflowDetail: {
    workflow: IWorkFlow;
    nodes: Node[];
    edges: Edge[];
  };
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    nodes,
    edges,
    initWorkflow,
    onNodesChange,
    onEdgesChange,
    onConnect,
    clearWorkflow,
    isPreview,
    previewNode,
    updatePreviewPosition,
    startAddPreviewNode,
    stopAddPreviewNode,
  } = useWorkFlow();

  const { screenToFlowPosition } = useReactFlow();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  /** 画布模式：指针模式 | 手模式 */
  const [interactionMode, setInteractionMode] = useState<"pointer" | "hand">(
    "pointer",
  );

  /** 当前激活的节点id */
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  /** 是否全屏 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allNodes = useMemo(() => {
    return isPreview ? [...nodes, previewNode] : nodes;
  }, [isPreview, nodes, previewNode]);

  // 初始化React Flow实例
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const handleStartAddNode = useCallback(
    (type: string) => {
      setActiveNodeId(null);
      setInteractionMode("pointer");
      startAddPreviewNode(type);
    },
    [startAddPreviewNode],
  );

  const getScreenToFlowPosition = useCallback(
    (e: MouseEvent) => {
      if (!reactFlowInstance) {
        return null;
      }
      return screenToFlowPosition({
        x: e.clientX + 8,
        y: e.clientY + 8,
      });
    },
    [reactFlowInstance, screenToFlowPosition],
  );

  const handlePaneClick = useCallback(() => {
    if (!reactFlowInstance) return;
    stopAddPreviewNode("place");
  }, [reactFlowInstance, stopAddPreviewNode]);

  const handlePaneMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPreview || !reactFlowInstance) return;
      updatePreviewPosition(getScreenToFlowPosition(e));
    },
    [
      isPreview,
      reactFlowInstance,
      getScreenToFlowPosition,
      updatePreviewPosition,
    ],
  );

  // 初始化工作流数据
  useEffect(() => {
    initWorkflow(
      workflowId,
      workflowDetail.workflow,
      workflowDetail.nodes,
      workflowDetail.edges,
    );

    // 组件卸载时清空数据
    return () => {
      clearWorkflow();
    };
  }, [workflowId, workflowDetail, initWorkflow, clearWorkflow]);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full bg-white${isPreview ? "cursor-crosshair" : ""}`}
    >
      <ReactFlow
        nodes={allNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={handlePaneClick}
        onPaneMouseMove={handlePaneMouseMove}
        onInit={handleInit}
        nodesDraggable={interactionMode === "pointer"}
        elementsSelectable={interactionMode === "pointer"}
        panOnDrag={interactionMode === "hand"}
        panOnScroll={interactionMode === "hand"}
        fitView
      >
        <Background />
        <FlowControls
          onStartAddNode={handleStartAddNode}
          interactionMode={interactionMode}
          onModeChange={setInteractionMode}
          // onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </ReactFlow>
    </div>
  );
};
export default WorkFlowCanvas;
