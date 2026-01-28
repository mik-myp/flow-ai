import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";

const GenerateImageNode = (props) => {
  return (
    <BaseNode {...props} icon={"+1"}>
      <NodeField label="图像模型" content={props.data.model} />{" "}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};
export default GenerateImageNode;
