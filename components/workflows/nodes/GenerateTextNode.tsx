import type { NodeProps, Node } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeData } from "@/types/workflow";
import FlowHandle from "../handles/FlowHandle";
import { useMemo } from "react";

const GenerateTextNode = (
  props: NodeProps<Node<BaseNodeData, "generateText">>,
) => {
  const content = useMemo(() => {
    return props.data.settingData?.textModel?.label || "";
  }, [props.data.settingData?.textModel]);

  return (
    <BaseNode {...props}>
      <NodeField label="文本模型" content={content} />
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
