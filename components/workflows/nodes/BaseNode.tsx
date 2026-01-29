import clsx from "clsx";
import EmEmoji from "@/components/emoji/EmEmoji";
import { Trash } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "antd";
import { Node, NodeProps } from "@xyflow/react";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import { nodeMeta } from "@/lib/workflows";

const BaseNode = ({
  children,
  selected,
  data,
  type,
}: NodeProps<Node<BaseNodeData, FlowNodeType>> & {
  children: React.ReactNode;
}) => {
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
        "w-87.5 rounded-md border bg-white text-black shadow-sm hover:border-blue-500 hover:shadow-md hover:ring-1 hover:ring-blue-500",
        "transition-shadow",
        selected && "border-blue-500 shadow-md ring-2 ring-blue-500",
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 border-b px-3 py-2">
        <EmEmoji id={nodeData.icon} size={20} />
        <div className="flex-1">{nodeData.title}</div>
        <Button
          icon={<Trash size={16} />}
          type="text"
          className="nodrag nopan"
        />
      </div>
      <div className="flex flex-col gap-y-2 p-3">{children}</div>
    </div>
  );
};

export default BaseNode;
