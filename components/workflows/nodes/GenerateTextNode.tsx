import type { NodeProps, Node } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeData } from "@/types/workflow";
import FlowHandle from "../handles/FlowHandle";

const GenerateTextNode = (
  props: NodeProps<Node<BaseNodeData, "generateText">>,
) => {
  return (
    <BaseNode {...props}>
      <NodeField
        label="文本模型"
        content={props.data.settingData?.textModel as string}
      />
      {props.id ? (
        <>
          <FlowHandle
            handles={[
              {
                label: "系统词",
                connectionCount: 1,
                handleId: "system",
              },
            ]}
          />
          <FlowHandle
            handles={[
              {
                label: "提示词",
                connectionCount: 1,
                handleId: "prompt",
              },
              {
                label: "结果",
                connectionCount: 1,
                handleId: "result",
              },
            ]}
          />
        </>
      ) : null}
    </BaseNode>
  );
};
export default GenerateTextNode;
