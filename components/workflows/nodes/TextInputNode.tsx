import type { Node, NodeProps } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeField from "./NodeField";
import { BaseNodeData } from "@/types/workflow";
import FlowHandle from "../handles/FlowHandle";
import { useMemo } from "react";

const TextInputNode = (props: NodeProps<Node<BaseNodeData, "textInput">>) => {
  const content = useMemo(() => {
    return props.data.settingData?.input || "";
  }, [props.data.settingData?.input]);

  return (
    <BaseNode {...props}>
      <NodeField label="文本输入" content={content} />
      {props.id ? (
        <FlowHandle
          handles={[
            null,
            {
              label: "文本",
              connectionCount: 1,
              handleId: "text",
            },
          ]}
        />
      ) : null}
    </BaseNode>
  );
};
export default TextInputNode;
