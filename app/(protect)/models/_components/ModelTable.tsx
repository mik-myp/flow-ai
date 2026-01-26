"use client";
import { IModel, ModelProvider } from "@/types/model";
import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const providerLabels: Record<ModelProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  "google-genai": "Google GenAI",
  "openai-compatible": "OpenAI 兼容",
};

const providerColors: Record<ModelProvider, string> = {
  openai: "blue",
  anthropic: "purple",
  "google-genai": "green",
  "openai-compatible": "cyan",
};

const ModelTable = ({ models }: { models: IModel[] }) => {
  const router = useRouter();

  const columns: TableColumnsType<IModel> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "提供商",
      dataIndex: "provider",
      key: "provider",
      render: (value: ModelProvider) => (
        <Tag color={providerColors[value]}>{providerLabels[value]}</Tag>
      ),
    },
    {
      title: "模型名称",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "API 基础 URL",
      dataIndex: "baseUrl",
      key: "baseUrl",
      ellipsis: true,
      render: (value?: string) => value || "-",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (value?: number) =>
        value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<Pencil size={16} />}
            // onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确认删除吗？"
            // onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" icon={<Trash size={16} />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<IModel>
      className="px-4 py-6"
      rowKey="id"
      dataSource={models}
      columns={columns}
      title={() => (
        <div className="flex justify-end">
          <Button type="primary" onClick={() => router.push("/models/new")}>
            添加新模型
          </Button>
        </div>
      )}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-8" />
        ),
      }}
    />
  );
};
export default ModelTable;
