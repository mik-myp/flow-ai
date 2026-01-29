import FlowEdge from "@/components/workflows/edges/FlowEdge";
import GenerateImageNode from "@/components/workflows/nodes/GenerateImageNode";
import GenerateTextNode from "@/components/workflows/nodes/GenerateTextNode";
import TextInputNode from "@/components/workflows/nodes/TextInputNode";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import type { Node } from "@xyflow/react";

export const nodeMeta: Record<
  FlowNodeType,
  Omit<Node<BaseNodeData>, "position"> & {
    meta: {
      icon: string;
      title: string;
      description: string;
      settingFidlds: {
        name: string;
        type: string;
        required: boolean;
        label: string;
      }[];
    };
  }
> = {
  textInput: {
    id: "textInput",
    meta: {
      icon: "pencil2",
      title: "文本输入",
      description: "文本输入描述",
      settingFidlds: [
        {
          name: "input",
          type: "textarea",
          required: true,
          label: "文本输入",
        },
      ],
    },
    data: {
      title: "文本输入",
      description: "",
      settingData: {
        input: "",
      },
    },
  },
  generateText: {
    id: "generateText",
    meta: {
      icon: "book",
      title: "生成文本",
      description: "根据系统词和提示词生成文本",
      settingFidlds: [
        {
          name: "textModel",
          type: "select",
          required: true,
          label: "文本模型",
        },
      ],
    },
    data: {
      title: "生成文本",
      description: "",
      model: "gpt-4",
      settingData: {
        textModel: undefined,
      },
    },
  },
  generateImage: {
    id: "generateImage",
    meta: {
      icon: "film_frames",
      title: "生成图像",
      description: "根据提示词生成图像",
      settingFidlds: [
        {
          name: "imageModel",
          type: "select",
          required: true,
          label: "图像模型",
        },
      ],
    },
    data: {
      title: "生成图像",
      description: "",
      model: "dall-e-3",
      settingData: {
        imageModel: undefined,
      },
    },
  },
};

export const nodeCatalog = Object.keys(nodeMeta).map((type) => {
  const nodeMetaItem = nodeMeta[type as FlowNodeType];
  return {
    ...nodeMetaItem,
    type: type,
  };
});

export const nodeTypes = {
  textInput: TextInputNode,
  generateText: GenerateTextNode,
  generateImage: GenerateImageNode,
};

export const edgeTypes = {
  flow: FlowEdge,
};
