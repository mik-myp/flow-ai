import FlowEdge from "@/components/flows/edges/FlowEdge";
import GenerateImageNode from "@/components/flows/nodes/GenerateImageNode";
import GenerateTextNode from "@/components/flows/nodes/GenerateTextNode";
import PreviewNode from "@/components/flows/nodes/PreviewNode";
import TextInputNode from "@/components/flows/nodes/TextInputNode";

export const nodeMeta = {
  textInput: {
    id: "textInput",
    meta: {
      icon: "keyboard",
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
      icon: "robot",
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
      settingData: {
        textModel: undefined,
      },
    },
  },
  generateImage: {
    id: "generateImage",
    meta: {
      icon: "image",
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
      settingData: {
        imageModel: undefined,
      },
    },
  },
};

export const nodeCatalog = Object.keys(nodeMeta).map((type) => ({
  ...nodeMeta[type],
  type: type,
}));

export const nodeTypes = {
  textInput: TextInputNode,
  generateText: GenerateTextNode,
  generateImage: GenerateImageNode,
};

export const edgeTypes = {
  flow: FlowEdge,
};
