"use client";

import FlowControls from "@/components/workflows/FlowControls";
import PreviewNode from "@/components/workflows/nodes/PreviewNode";
import { edgeTypes, nodeCatalog, nodeMeta, nodeTypes } from "@/lib/workflows";
import useWorkFlow from "@/lib/workflows/store";
import type { FlowNodeType, IWorkFlow } from "@/types/workflow";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { Background, ReactFlow, useReactFlow } from "@xyflow/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { v4 as uuidv4 } from "uuid";

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

  /** 鼠标移动时的位置  */
  const pointPosRef = useRef<{ x: number; y: number } | null>(null);

  const reactFlow = useReactFlow();

  const {
    nodes,
    edges,
    initWorkflow,
    onNodesChange,
    onEdgesChange,
    onConnect,
    clearWorkflow,
    addNode,
  } = useWorkFlow();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  /** 画布模式：指针模式 | 手模式 */
  const [interactionMode, setInteractionMode] = useState<"pointer" | "hand">(
    "pointer",
  );

  /** 等待添加到画布的节点类型 */
  const [pendingAddNodeType, setPendingAddNodeType] = useState<string | null>(
    null,
  );

  /** 鼠标位置 */
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /** 当前激活的节点id */
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  /** 是否全屏 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderPreviewNode = useMemo(() => {
    if (pendingAddNodeType && cursorPosition) {
      return (
        <div
          className="pointer-events-none absolute top-0 left-0 z-20 opacity-80"
          style={{
            transform: `translate(${cursorPosition.x + 8}px, ${cursorPosition.y + 8}px)`,
          }}
        >
          <PreviewNode type={pendingAddNodeType as FlowNodeType} />
        </div>
      );
    }
    return null;
  }, [pendingAddNodeType, cursorPosition]);

  const getLocalPoint = useCallback((point: { x: number; y: number }) => {
    const bounds = wrapperRef.current?.getBoundingClientRect();
    if (!bounds) {
      return null;
    }
    return {
      x: point.x - bounds.left,
      y: point.y - bounds.top,
    };
  }, []);

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  /** 进入所选节点类型的放置模式。 */
  const handleStartAddNode = useCallback(
    (type: string) => {
      setActiveNodeId(null);
      setInteractionMode("pointer");
      setPendingAddNodeType(type);
      const lastPoint = pointPosRef.current;
      if (lastPoint) {
        const localPoint = getLocalPoint(lastPoint);
        if (localPoint) {
          setCursorPosition(localPoint);
        }
      }
    },
    [getLocalPoint],
  );

  /** 在点击位置提交待放置节点。 */
  const handlePaneClick = useCallback(
    (e: MouseEvent) => {
      if (!pendingAddNodeType || !reactFlowInstance) {
        return;
      }
      const definition = nodeCatalog.find(
        (item) => item.type === pendingAddNodeType,
      );
      if (!definition) {
        return;
      }

      /** 将屏幕坐标转换为画布坐标用于放置。 */
      const position = reactFlow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: pendingAddNodeType,
        position,
        data: { ...definition.data },
      };
      addNode(newNode);
      setActiveNodeId(newNode.id);
      setPendingAddNodeType(null);
      setCursorPosition(null);
    },
    [pendingAddNodeType, reactFlowInstance, addNode, reactFlow],
  );

  /** 跟踪鼠标移动以定位预览节点。 */
  const handleWrapperMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const screenPoint = { x: event.clientX, y: event.clientY };
      pointPosRef.current = screenPoint;
      if (!pendingAddNodeType) {
        return;
      }
      const localPoint = getLocalPoint(screenPoint);
      if (localPoint) {
        setCursorPosition(localPoint);
      }
    },
    [getLocalPoint, pendingAddNodeType],
  );

  const handleWrapperMouseLeave = useCallback(() => {
    if (pendingAddNodeType) {
      setCursorPosition(null);
    }
  }, [pendingAddNodeType]);

  /** 切换画布容器全屏模式。 */
  const handleToggleFullscreen = useCallback(async () => {
    if (!wrapperRef.current) {
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await wrapperRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
      className={`relative h-full w-full bg-white${pendingAddNodeType ? "cursor-crosshair" : ""}`}
      onMouseMove={handleWrapperMouseMove}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={handlePaneClick}
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
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </ReactFlow>
      {renderPreviewNode}
    </div>
  );
};
export default WorkFlowCanvas;
