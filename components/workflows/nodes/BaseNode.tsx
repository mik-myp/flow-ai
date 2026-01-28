import clsx from "clsx";
import EmEmoji from "@/components/emoji/EmEmoji";
import { Trash } from "lucide-react";
import React from "react";
import { Button } from "antd";
import { Node, NodeProps } from "@xyflow/react";
import { FlowNode } from "@/types/workflow";

const BaseNode = ({
  children,
  selected,
  icon,
  data,
}: NodeProps<Node<FlowNode>> & {
  children: React.ReactNode;
  icon: string;
}) => {
  return (
    <div
      className={clsx(
        "w-87.5 rounded-md border bg-white text-black shadow-sm hover:border-blue-500 hover:shadow-md hover:ring-1 hover:ring-blue-500",
        "transition-shadow",
        selected && "border-blue-500 shadow-md ring-2 ring-blue-500",
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 border-b px-3 py-2">
        <EmEmoji id={icon} size={20} />
        <div className="flex-1">{data.data.title}</div>
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
