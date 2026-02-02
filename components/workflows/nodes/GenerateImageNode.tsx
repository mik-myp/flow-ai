import type { NodeProps, Node } from "@xyflow/react";
import BaseNode from "./BaseNode";
import { BaseNodeData } from "@/types/workflow";

const GenerateImageNode = (
  props: NodeProps<Node<BaseNodeData, "generateImage">>,
) => {
  return <BaseNode {...props} />;
};
export default GenerateImageNode;
