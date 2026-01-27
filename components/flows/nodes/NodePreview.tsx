import { FlowNodeType } from "@/types/flows";
import BaseNode from "./BaseNode";

const NodePreview = ({ type }: { type: FlowNodeType }) => {
  return (
    <BaseNode
      id="node-preview"
      data={{}}
      type={type}
      selected={false}
      dragging={false}
      draggable={false}
      selectable={false}
      deletable={false}
      zIndex={0}
      isConnectable={false}
      positionAbsoluteX={0}
      positionAbsoluteY={0}
    />
  );
};

export default NodePreview;
