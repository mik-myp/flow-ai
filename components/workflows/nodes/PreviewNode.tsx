import { nodeMeta, nodeTypes } from "@/lib/workflows";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import { NodeProps, Node } from "@xyflow/react";
import React from "react";

const PreviewNode = ({ type }: { type: FlowNodeType }) => {
  const node = nodeMeta[type];

  if (!node || !type) return null;

  const Component = nodeTypes[type] as React.ComponentType<
    NodeProps<Node<BaseNodeData, FlowNodeType>>
  >;

  return (
    <Component
      id=""
      type={type}
      data={node.data}
      selectable={false}
      selected={false}
      dragging={false}
      deletable={false}
      draggable={false}
      zIndex={1}
      isConnectable={false}
      positionAbsoluteX={0}
      positionAbsoluteY={0}
    />
  );
};

export default PreviewNode;
