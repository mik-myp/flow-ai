import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";

const GenerateTextNode = (props) => {
  return (
    <BaseNode {...props} icon={"+1"}>
      <NodeField label="文本模型" content={props.data.model} />{" "}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};
export default GenerateTextNode;
