"use client";

import FlowControls from "@/components/flows/FlowControls";
import NodePreview from "@/components/flows/nodes/NodePreview";
import { edgeTypes, nodeTypes } from "@/lib/flows";
import { FlowNodeType } from "@/types/flows";
import {
  Background,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const WorkFlowCanvas = ({
  workflowId,
  workflowDetail,
}: {
  workflowId: string;
  workflowDetail: {
    nodes: Node[];
    edges: Edge[];
  };
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(workflowDetail.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflowDetail.edges);

  const reactFlow = useReactFlow<Node, Edge>();

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

  /** 鼠标移动时的位置  */
  const pointPosRef = useRef<{ x: number; y: number } | null>(null);

  /** 记录拖拽中的节点，避免重复记录历史 */
  const draggingNodeIdsRef = useRef<Set<string>>(new Set());

  /** 当前激活的节点id */
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  /** 当前悬浮的边 */
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  /** 是否全屏 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canUndo = false;

  const canRedo = false;

  /** 当前激活节点的信息 */
  const activeNode = useMemo(
    () => nodes.find((node) => node.id === activeNodeId) ?? null,
    [nodes, activeNodeId],
  );

  /**更新节点状态 */
  const handleNodesChange = () => {};

  /** 更新边状态 */
  const handleEdgesChange = () => {};

  /** 连线 */
  const handleConnect = () => {};

  /** 鼠标移入边 */
  const handleEdgeMouseEnter = useCallback((_event: MouseEvent, edge: Edge) => {
    setHoveredEdgeId(edge.id);
  }, []);

  /** 鼠标离开边 */
  const handleEdgeMouseLeave = useCallback(() => {
    setHoveredEdgeId(null);
  }, []);

  /** 在点击位置提交待放置节点。 */
  const placePendingNode = useCallback(
    (screenPoint: { x: number; y: number }) => {
      if (!workflowId || !pendingAddNodeType) {
        return;
      }
    },
    [workflowId, pendingAddNodeType],
  );

  /** 添加节点 */
  const handleStartAddNode = () => {};

  /** 撤销 */
  const handleUndo = () => {};

  /** 重做 */
  const handleRedo = () => {};

  /** 点击节点 */
  const handleNodeClick = useCallback((event: MouseEvent, node: Node) => {
    setActiveNodeId(node.id);
  }, []);

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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onEdgeMouseEnter={handleEdgeMouseEnter}
        onEdgeMouseLeave={handleEdgeMouseLeave}
        onNodeClick={handleNodeClick}
        nodesDraggable={interactionMode === "pointer"}
        elementsSelectable={interactionMode === "pointer"}
        panOnDrag={interactionMode === "hand"}
        panOnScroll={interactionMode === "hand"}
        fitView
      >
        <Background />
        <FlowControls
          onStartAddNode={handleStartAddNode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          interactionMode={interactionMode}
          onModeChange={setInteractionMode}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </ReactFlow>
      {pendingAddNodeType && cursorPosition ? (
        <div
          className="pointer-events-none absolute top-0 left-0 z-20 opacity-80"
          style={{
            transform: `translate(${cursorPosition.x + 8}px, ${cursorPosition.y + 8}px)`,
          }}
        >
          <NodePreview type={pendingAddNodeType} />
        </div>
      ) : null}
    </div>
  );
};
export default WorkFlowCanvas;
