import type { NodeProps, Node } from "@xyflow/react";
import BaseNode from "./BaseNode";
import { BaseNodeData } from "@/types/workflow";

const GenerateTextNode = (
  props: NodeProps<Node<BaseNodeData, "generateText">>,
) => {
  return <BaseNode {...props} />;
};
export default GenerateTextNode;
