import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeMeta, TextInputFlowNode } from "@/types/workflow";

const TextInputNode = ({
  data,
  ...rest
}: NodeProps<TextInputFlowNode> & BaseNodeMeta) => {
  return (
    <BaseNode {...rest} data={data} icon={"+1"}>
      <NodeField
        label="文本输入"
        content="某些浏览器会缓存流式响应。你可能需要等到响应超过 1024 字节才能看到流式响应。这通常只影响 hello world 应用程序，而不影响真实应用程序。"
      />
      {rest.id ? <Handle type="source" position={Position.Right} /> : null}
    </BaseNode>
  );
};
export default TextInputNode;
