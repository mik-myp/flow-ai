import type { NodeProps, Node } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeData } from "@/types/workflow";
import FlowHandle from "../handles/FlowHandle";

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
        <FlowHandle
          handles={[
            {
              label: "提示词",
              connectionCount: 1,
              handleId: "prompt",
            },
          ]}
        />
      ) : null}
    </BaseNode>
  );
};
export default GenerateImageNode;
