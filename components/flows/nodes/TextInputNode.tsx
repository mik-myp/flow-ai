import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";

const TextInputNode = (props) => {
  return (
    <BaseNode {...props} icon={"+1"}>
      <NodeField
        label="文本输入"
        content="某些浏览器会缓存流式响应。你可能需要等到响应超过 1024
          字节才能看到流式响应。这通常只影响“hello
          world”应用程序，而不影响真实应用程序。"
      />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};
export default TextInputNode;
