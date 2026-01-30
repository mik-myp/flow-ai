import clsx from "clsx";
import NodeIcon from "@/components/workflows/NodeIcon";
import { Trash } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "antd";
import { Edge, Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import { nodeMeta } from "@/lib/workflows/constant";

const BaseNode = ({
  children,
  selected,
  data,
  type,
  id,
}: NodeProps<Node<BaseNodeData, FlowNodeType>> & {
  children: React.ReactNode;
}) => {
  const { deleteElements } = useReactFlow<Node, Edge>();

  const nodeData = useMemo(() => {
    const node = nodeMeta[type];
    return {
      icon: node.meta.icon,
      title: data.title ?? node.meta.title,
    };
  }, [type, data]);

  return (
    <div
      className={clsx(
        "group w-87.5 rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-sm transition-colors duration-150 hover:border-blue-500 hover:shadow-md",
        selected && "border-blue-500 shadow-md ring-2 ring-blue-500",
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 rounded-t-xl border-b border-slate-200/70 bg-slate-50/60 px-3 py-2.5">
        <NodeIcon icon={nodeData.icon} size={18} />
        <div className="flex-1 truncate text-sm font-medium text-slate-900">
          {nodeData.title}
        </div>
        <Button
          icon={<Trash size={16} />}
          type="text"
          className="nodrag nopan text-slate-500 transition-colors hover:text-rose-500"
          onClick={() => deleteElements({ nodes: [{ id }] })}
        />
      </div>
      <div className="flex flex-col gap-y-2.5 rounded-b-xl px-3 py-2.5 text-xs text-slate-700">
        {children}
      </div>
    </div>
  );
};

export default BaseNode;
