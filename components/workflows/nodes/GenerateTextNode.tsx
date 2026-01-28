import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { GenerateTextFlowNode } from "@/types/workflow";

const GenerateTextNode = ({
  data,
  isPreview,
  ...rest
}: NodeProps<GenerateTextFlowNode> & {
  isPreview?: boolean;
}) => {
  return (
    <BaseNode {...rest} data={data} icon={"+1"} selected={rest.selected}>
      <NodeField
        label="文本模型"
        content={data.settingData?.textModel as string}
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
export default GenerateTextNode;
