"use client";
import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getSimpleBezierPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import AddNodePopover from "../AddNodePopover";
import { BaseNodeData, FlowNodeType, TEdge, TNode } from "@/types/workflow";
import { nodeCatalog } from "@/lib/workflows/constant";
import { v4 as uuidv4 } from "uuid";

type FlowEdgeData = {
  isHovered?: boolean;
};

const HANDLE_OFFSET = 12;

const getHandleOffset = (position: Position | undefined, offset: number) => {
  switch (position) {
    case Position.Left:
      return { x: offset, y: 0 };
    case Position.Right:
      return { x: -offset, y: 0 };
    case Position.Top:
      return { x: 0, y: offset };
    case Position.Bottom:
      return { x: 0, y: -offset };
    default:
      return { x: 0, y: 0 };
  }
};

const FlowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
  style,
  selected,
  data,
}: EdgeProps<Edge<FlowEdgeData>>) => {
  const { deleteElements, getEdges, getNodes, addNodes, addEdges, updateEdge } =
    useReactFlow<TNode, TEdge>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const sourceOffset = getHandleOffset(sourcePosition, HANDLE_OFFSET);
  const targetOffset = getHandleOffset(targetPosition, HANDLE_OFFSET);

  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX: sourceX + sourceOffset.x,
    sourceY: sourceY + sourceOffset.y,
    targetX: targetX + targetOffset.x,
    targetY: targetY + targetOffset.y,
    sourcePosition,
    targetPosition,
  });

  const handleInsertNode = ({
    edgeId,
    type,
    position,
  }: {
    edgeId: string;
    type: FlowNodeType;
    position: { x: number; y: number };
  }) => {
    const edges = getEdges();
    const nodes = getNodes();
    const targetEdge = edges.find((edge) => edge.id === edgeId);
    const newNodeId = uuidv4();

    const newEdgeId = uuidv4();

    if (!targetEdge) return;

    const definition = nodeCatalog.find((item) => item.type === type);
    if (!definition) {
      return;
    }

    const sameTypeNodes = nodes.filter((node) => node.type === type);

    const baseData = {
      ...definition.data,
      title: `${definition.meta.title} ${sameTypeNodes.length + 1}`,
    } as BaseNodeData;

    const settingData = baseData.settingData ? { ...baseData.settingData } : {};

    const newNode: TNode = {
      id: newNodeId,
      type,
      position,
      data: {
        ...baseData,
        settingData,
      },
      updated_at: new Date().toISOString(),
    };

    addNodes(newNode);
    // 遵循 左改右删
    if (type === "textInput") {
      deleteElements({ edges: [{ id: edgeId }] });
      addEdges({
        id: newEdgeId,
        type: "flow",
        updated_at: new Date().toISOString(),
        target: newNodeId,
        targetHandle: "text",
        source: targetEdge.source,
        sourceHandle: targetEdge.sourceHandle,
      });
    } else if (type === "generateText") {
      updateEdge(edgeId, {
        source: newNodeId,
        sourceHandle: "system",
      });
      addEdges({
        id: newEdgeId,
        type: "flow",
        updated_at: new Date().toISOString(),
        target: newNodeId,
        targetHandle: "result",
        source: targetEdge.source,
        sourceHandle: targetEdge.sourceHandle,
      });
    } else if (type === "generateImage") {
      updateEdge(edgeId, {
        source: newNodeId,
        sourceHandle: "prompt",
      });
    }
  };

  const isHovered = Boolean(data?.isHovered);
  const showControls = isHovered || isPopoverOpen;

  const edgeStyle = selected ? { ...(style ?? {}), stroke: "#2970ff" } : style;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={16}
      />
      <EdgeLabelRenderer>
        <div
          className={`nodrag nopan flex items-center gap-2 transition-opacity ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: showControls ? "all" : "none",
          }}
        >
          <AddNodePopover
            onSelect={(type) => {
              handleInsertNode({
                edgeId: id,
                type,
                position: { x: labelX, y: labelY },
              });
            }}
            onOpenChange={setIsPopoverOpen}
          >
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2970ff] text-white"
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              aria-label="添加节点"
            >
              <Plus size={12} />
            </button>
          </AddNodePopover>
          <button
            type="button"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2970ff] text-white"
            onClick={(event) => {
              event.stopPropagation();
              void deleteElements({ edges: [{ id }] });
            }}
            onMouseDown={(event) => event.stopPropagation()}
            aria-label="删除连线"
          >
            <X size={12} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default FlowEdge;
