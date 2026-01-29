"use client";

import FlowControls from "@/components/workflows/FlowControls";
import PreviewNode from "@/components/workflows/nodes/PreviewNode";

import { edgeTypes, nodeCatalog, nodeTypes } from "@/lib/workflows";
import useWorkFlow from "@/lib/workflows/store";
import type { FlowNodeType, IWorkFlow, TEdge, TNode } from "@/types/workflow";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { Background, ReactFlow } from "@xyflow/react";
import { message } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { v4 as uuidv4 } from "uuid";

// 添加防抖函数
const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

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
  const previewRafRef = useRef<number | null>(null);
  const latestCursorRef = useRef<{ x: number; y: number } | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance<TNode, TEdge> | null>(
    null,
  );

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

  /** 是否全屏 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 创建防抖后的保存函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSaveWorkflow = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    debounce(
      async (
        currentWorkflowId: string,
        currentNodes: Node[],
        currentEdges: Edge[],
      ) => {
        try {
          const response = await fetch("/workflow/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workflowId: currentWorkflowId,
              nodes: currentNodes,
              edges: currentEdges,
            }),
          });
          console.log("response", response);

          if (!response.ok) {
            message.error("保存工作流失败");
          } else {
            message.success("工作流保存成功");
          }
        } catch {
          message.error("保存工作流时发生错误");
        }
      },
      5000,
    ),
    [],
  );

  // 当nodes或edges变化时，调用防抖保存函数
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      debouncedSaveWorkflow(workflowId, nodes, edges);
    }
  }, [nodes, edges, debouncedSaveWorkflow, workflowId]);

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

  const handleInit = useCallback(
    (instance: ReactFlowInstance<TNode, TEdge>) => {
      reactFlowInstanceRef.current = instance;
    },
    [],
  );

  /** 进入所选节点类型的放置模式。 */
  const handleStartAddNode = useCallback(
    (type: string) => {
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
      const instance = reactFlowInstanceRef.current;
      if (!pendingAddNodeType || !instance) {
        return;
      }
      const definition = nodeCatalog.find(
        (item) => item.type === pendingAddNodeType,
      );
      if (!definition) {
        return;
      }

      /** 将屏幕坐标转换为画布坐标用于放置。 */
      const position = instance.screenToFlowPosition({
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
      setPendingAddNodeType(null);
      setCursorPosition(null);
    },
    [pendingAddNodeType, addNode],
  );

  /** 跟踪鼠标移动以定位预览节点。 */
  const handleWrapperMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const screenPoint = { x: event.clientX, y: event.clientY };
      pointPosRef.current = screenPoint;
      if (!pendingAddNodeType) {
        return;
      }
      latestCursorRef.current = screenPoint;
      if (previewRafRef.current !== null) {
        return;
      }
      previewRafRef.current = requestAnimationFrame(() => {
        previewRafRef.current = null;
        const latestPoint = latestCursorRef.current;
        if (!latestPoint) {
          return;
        }
        const localPoint = getLocalPoint(latestPoint);
        if (localPoint) {
          setCursorPosition(localPoint);
        }
      });
    },
    [getLocalPoint, pendingAddNodeType],
  );

  const handleWrapperMouseLeave = useCallback(() => {
    if (pendingAddNodeType) {
      if (previewRafRef.current !== null) {
        cancelAnimationFrame(previewRafRef.current);
        previewRafRef.current = null;
      }
      latestCursorRef.current = null;
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
    return () => {
      if (previewRafRef.current !== null) {
        cancelAnimationFrame(previewRafRef.current);
      }
    };
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
      className={`relative h-full w-full bg-white${
        pendingAddNodeType ? "cursor-crosshair" : ""
      }`}
      onMouseMove={handleWrapperMouseMove}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <ReactFlow<TNode, TEdge>
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
        onlyRenderVisibleElements
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
