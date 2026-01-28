import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { GenerateImageFlowNode } from "@/types/workflow";

const GenerateImageNode = ({
  data,
  isPreview,
  ...rest
}: NodeProps<GenerateImageFlowNode> & {
  isPreview?: boolean;
}) => {
  return (
    <BaseNode {...rest} data={data} icon={"+1"} selected={rest.selected}>
      <NodeField
        label="图像模型"
        content={data.settingData?.imageModel as string}
      />
      {isPreview ? null : (
        <>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </>
      )}
    </BaseNode>
  );
};
export default GenerateImageNode;
