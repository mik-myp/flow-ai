import type { NodeProps, Node } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeData } from "@/types/workflow";

const GenerateImageNode = (
  props: NodeProps<Node<BaseNodeData, "generateImage">>,
) => {
  return (
    <BaseNode {...props}>
      <NodeField
        label="图像模型"
        content={props.data.settingData?.imageModel as string}
      />
      {props.id ? (
        <>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </>
      ) : null}
    </BaseNode>
  );
};
export default GenerateImageNode;
