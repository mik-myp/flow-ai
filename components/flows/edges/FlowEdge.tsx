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
import type { FlowNodeType } from "@/types/flows";

type FlowEdgeData = {
  onStartAddNode?: (type: FlowNodeType) => void;
  onInsertNode?: (payload: {
    edgeId: string;
    type: FlowNodeType;
    position: { x: number; y: number };
  }) => void;
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
  const { deleteElements } = useReactFlow<Node, Edge>();
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

  const onStartAddNode = data?.onStartAddNode;
  const onInsertNode = data?.onInsertNode;
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
              if (onInsertNode) {
                onInsertNode({
                  edgeId: id,
                  type,
                  position: { x: labelX, y: labelY },
                });
                return;
              }
              onStartAddNode?.(type);
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
