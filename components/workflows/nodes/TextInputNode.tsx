import type { Node, NodeProps } from "@xyflow/react";
import BaseNode from "./BaseNode";
import { BaseNodeData } from "@/types/workflow";

const TextInputNode = (props: NodeProps<Node<BaseNodeData, "textInput">>) => {
  return <BaseNode {...props} showTarget={false}></BaseNode>;
};
export default TextInputNode;
