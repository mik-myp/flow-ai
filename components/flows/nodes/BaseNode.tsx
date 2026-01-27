"use client";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import EmEmoji from "@/components/emoji/EmEmoji";
import type { BaseNodeData, FlowNodeType } from "@/types/flows";
import { Plus } from "lucide-react";
import { useState } from "react";
import { nodeMeta } from "@/lib/flows";

const BaseNode = (props: NodeProps<Node<BaseNodeData, FlowNodeType>>) => {
  const { type, data, selected } = props;

  const {
    originIcon,
    originTitle,
    showSource = true,
    showTarget = true,
  } = nodeMeta[type];

  const [hover, setHover] = useState(false);

  const title = data.title ?? originTitle;

  return (
    <div
      className={clsx(
        "min-w-60 rounded-xl bg-white px-3 py-3 shadow-sm hover:shadow-md",
        "transition-shadow",
        selected && "shadow-md ring-2 ring-blue-500",
      )}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {showTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="h-7.5! w-7.5! rounded-none! border-0! bg-transparent!"
        >
          {(hover || selected) && (
            <Plus
              className="pointer-events-none absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-2xl bg-[#2970ff] transition-all"
              size={10}
              color="#fff"
            />
          )}
        </Handle>
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="h-7.5! w-7.5! rounded-none! border-0! bg-transparent!"
        >
          {(hover || selected) && (
            <Plus
              className="pointer-events-none absolute top-2 right-1.5 flex h-4 w-4 items-center justify-center rounded-2xl bg-[#2970ff] transition-all"
              size={10}
              color="#fff"
            />
          )}
        </Handle>
      )}
      <div className="flex items-center gap-2">
        <span className="relative flex h-6 w-6 shrink-0 grow-0 items-center justify-center overflow-hidden rounded-lg border-[0.5px] border-[#10182814] text-[14px]">
          <EmEmoji id={originIcon} />
        </span>
        <div className="truncate text-sm font-semibold text-slate-900">
          {title}
        </div>
      </div>
    </div>
  );
};

export default BaseNode;
