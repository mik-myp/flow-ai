import { nodeMeta } from "@/lib/workflows";
import { FlowNodeType } from "@/types/workflow";
import React from "react";
import TextInputNode from "./TextInputNode";

const PreviewNode = ({ type }: { type: FlowNodeType }) => {
  const node = nodeMeta[type];

  if (!node || !type) return null;

  if (type === "textInput") return <TextInputNode data={node} />;
};

export default PreviewNode;
