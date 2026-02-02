import FlowEdge from "@/components/workflows/edges/FlowEdge";
import GenerateImageNode from "@/components/workflows/nodes/GenerateImageNode";
import GenerateTextNode from "@/components/workflows/nodes/GenerateTextNode";
import TextInputNode from "@/components/workflows/nodes/TextInputNode";
import { BaseNodeData, FlowNodeType } from "@/types/workflow";
import type { Node } from "@xyflow/react";
import type { SelectProps } from "antd";
import type { LucideIcon } from "lucide-react";
import { House, Image, Sparkles, TextCursorInput } from "lucide-react";

type NodeSettingField = {
  name: string;
  type: string;
  required: boolean;
  label: string;
  fieldNames?: SelectProps["fieldNames"];
  optionsSource?: string;
};

type NodeMeta = {
  iconProps: {
    icon: LucideIcon;
    bgColor: string;
  };
  title: string;
  description: string;
  settingFields?: NodeSettingField[];
};

export const nodeMeta: Record<
  FlowNodeType,
  Omit<Node<BaseNodeData>, "position"> & {
    meta: NodeMeta;
  }
> = {
  textInput: {
    id: "textInput",
    meta: {
      iconProps: { icon: TextCursorInput, bgColor: "#17B26A" },
      title: "文本输入",
      description: "文本输入描述",
      settingFields: [
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
      iconProps: { icon: Sparkles, bgColor: "#F79009" },
      title: "生成文本",
      description: "根据系统词和提示词生成文本",
      settingFields: [
        {
          name: "textModel",
          type: "select",
          required: true,
          label: "文本模型",
          fieldNames: {
            label: "name",
            value: "id",
          },
          optionsSource: "models",
        },
        {
          name: "system",
          type: "textarea",
          required: true,
          label: "系统词",
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
      iconProps: { icon: Image, bgColor: "#6172F3" },
      title: "生成图像",
      description: "根据提示词生成图像",
      settingFields: [
        {
          name: "imageModel",
          type: "select",
          required: true,
          label: "图像模型",
          fieldNames: {
            label: "name",
            value: "id",
          },
          optionsSource: "models",
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

export const nodeCatalog: (Omit<
  Node<BaseNodeData, FlowNodeType>,
  "position"
> & {
  meta: NodeMeta;
})[] = Object.keys(nodeMeta).map((type) => {
  const nodeMetaItem = nodeMeta[type as FlowNodeType];
  return {
    ...nodeMetaItem,
    type: type as FlowNodeType,
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
