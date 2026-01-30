"use client";

import FlowControls from "@/components/workflows/FlowControls";
import PreviewNode from "@/components/workflows/nodes/PreviewNode";
import NodeSettingsDrawer from "@/components/workflows/NodeSettings";

import { edgeTypes, nodeCatalog, nodeTypes } from "@/lib/workflows/constant";
import type {
  BaseNodeData,
  FlowNodeType,
  IWorkFlow,
  TEdge,
  TNode,
} from "@/types/workflow";
import {
  Edge,
  Node,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react";
import { Background, ReactFlow } from "@xyflow/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useDebounceFn, useUpdateEffect } from "ahooks";

const WorkFlowCanvas = ({
  workflowId,
  workflowDetail,
}: {
  workflowId: string;
  workflowDetail: {
    workflow: IWorkFlow;
    nodes: TNode[];
    edges: TEdge[];
  };
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const isMounted = useRef(false);

  /** 鼠标移动时的位置  */
  const pointPosRef = useRef<{ x: number; y: number } | null>(null);
  const previewRafRef = useRef<number | null>(null);
  const latestCursorRef = useRef<{ x: number; y: number } | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance<TNode, TEdge> | null>(
    null,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<TNode>(
    workflowDetail.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<TEdge>(
    workflowDetail.edges,
  );

  /** 画布模式：指针模式 | 手模式 */
  const [interactionMode, setInteractionMode] = useState<"pointer" | "hand">(
    "pointer",
  );

  /** 等待添加到画布的节点类型 */
  const [pendingAddNodeType, setPendingAddNodeType] =
    useState<FlowNodeType | null>(null);

  /** 鼠标位置 */
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /** 是否全屏 */

  const [isFullscreen, setIsFullscreen] = useState(false);

  /** 当前激活的节点id */
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  /** 当前悬浮的边 */
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const activeNode = useMemo(
    () => nodes.find((node) => node.id === activeNodeId),
    [activeNodeId, nodes],
  );

  const edgesWithMeta = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: "flow",
        data: {
          ...(edge.data ?? {}),
          isHovered: edge.id === hoveredEdgeId,
        },
      })),
    [edges, hoveredEdgeId],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleUpdateNodeData = useCallback(
    (nodeId: string, data: Partial<BaseNodeData>) => {
      setNodes((prev) => {
        const now = new Date().toISOString();
        return prev.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }
          return {
            ...node,
            data: {
              ...(node.data as BaseNodeData),
              ...data,
            },
            updated_at: now,
          };
        });
      });
    },
    [setNodes],
  );

  const handleEdgeClick = useCallback((event: MouseEvent, edge: Edge) => {
    setActiveNodeId(null);
  }, []);

  const handleNodeClick = useCallback((event: MouseEvent, node: TNode) => {
    setActiveNodeId(node.id);
  }, []);

  const handleEdgeMouseEnter = useCallback((_event: MouseEvent, edge: Edge) => {
    setHoveredEdgeId(edge.id);
  }, []);

  const handleEdgeMouseLeave = useCallback(() => {
    setHoveredEdgeId(null);
  }, []);

  const { run } = useDebounceFn(
    async (
      currentWorkflowId: string,
      currentNodes: Node[],
      currentEdges: Edge[],
    ) => {
      await fetch("/workflow/save", {
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
    },
    {
      wait: 5000,
    },
  );

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
    (type: FlowNodeType) => {
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
      setActiveNodeId(null);
      if (!pendingAddNodeType || !instance) {
        return;
      }

      const definition = nodeCatalog.find(
        (item) => item.type === pendingAddNodeType,
      );
      if (!definition) {
        return;
      }

      const sameTypeNodes = nodes.filter(
        (node) => node.type === pendingAddNodeType,
      );

      /** 将屏幕坐标转换为画布坐标用于放置。 */
      const position = instance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const baseData = {
        ...definition.data,
        title: `${definition.meta.title} ${sameTypeNodes.length + 1}`,
      } as BaseNodeData;

      const settingData = baseData.settingData
        ? { ...baseData.settingData }
        : {};

      const newNode: TNode = {
        id: uuidv4(),
        type: pendingAddNodeType,
        position,
        data: {
          ...baseData,
          settingData,
        },
        updated_at: new Date().toISOString(),
      };
      setNodes((prev) => [...prev, newNode]);
      setPendingAddNodeType(null);
      setCursorPosition(null);
    },
    [pendingAddNodeType, setNodes, nodes],
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
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (previewRafRef.current !== null) {
        cancelAnimationFrame(previewRafRef.current);
      }
      isMounted.current = false;
    };
  }, []);

  useUpdateEffect(() => {
    if (
      (nodes.length > 0 || edges.length > 0) &&
      reactFlowInstanceRef.current
    ) {
      run(workflowId, nodes, edges);
    }
  }, [nodes, edges, run, workflowId]);

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
        edges={edgesWithMeta}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={handlePaneClick}
        onInit={handleInit}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onEdgeMouseEnter={handleEdgeMouseEnter}
        onEdgeMouseLeave={handleEdgeMouseLeave}
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
      {activeNode && (
        <NodeSettingsDrawer
          node={activeNode}
          onClose={() => setActiveNodeId(null)}
          onUpdateNode={handleUpdateNodeData}
        />
      )}
    </div>
  );
};
export default WorkFlowCanvas;
