import FlowEdge from "@/components/flows/edges/FlowEdge";
import BaseNode from "@/components/flows/nodes/BaseNode";
import { FlowNodeType, NodeCatalogItem, TNode } from "@/types/flows";

export const nodeMeta: Record<FlowNodeType, TNode> = {
  start: {
    id: "start",
    originIcon: "rocket",
    originTitle: "开始",
    originDescription: "开始节点",
    data: {},
    showTarget: false,
  },
  end: {
    id: "end",
    originIcon: "checkered_flag",
    originTitle: "结束",
    originDescription: "结束节点",
    data: {},
    showSource: false,
  },
  llm: {
    id: "llm",
    originIcon: "sparkles",
    originTitle: "LLM",
    originDescription: "调用大语言模型回答问题或者对自然语言进行处理",
    data: {
      settingSchema: {
        fields: [
          {
            name: "modelId",
            label: "模型",
            type: "select",
            required: true,
            optionsSource: "models",
          },
        ],
      },
    },
  },
  userInput: {
    id: "userInput",
    originIcon: "keyboard",
    originTitle: "用户输入",
    originDescription: "由用户提供输入内容，用于驱动后续节点",
    data: {
      settingSchema: {
        fields: [
          {
            name: "input",
            label: "用户输入",
            type: "textarea",
            required: true,
          },
        ],
      },
    },
  },
  prompt: {
    id: "prompt",
    originIcon: "memo",
    originTitle: "Prompt",
    originDescription: "通过精心设计提示词，提升大语言模型回答效果",
    data: {
      settingSchema: {
        fields: [
          {
            name: "prompt",
            label: "提示词",
            type: "textarea",
            required: true,
          },
        ],
      },
    },
  },
};

export const nodeCatalog: NodeCatalogItem[] = (
  Object.keys(nodeMeta) as FlowNodeType[]
).map((type) => ({
  ...nodeMeta[type],
  type,
}));

export const nodeTypes = {
  start: BaseNode,
  end: BaseNode,
  llm: BaseNode,
  prompt: BaseNode,
  userInput: BaseNode,
};

export const edgeTypes = {
  flow: FlowEdge,
};
