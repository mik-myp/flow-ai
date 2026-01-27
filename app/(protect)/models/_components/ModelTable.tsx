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
  message,
} from "antd";
import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const providerLabels: Record<ModelProvider, string> = {
  "ai-gateway": "AI 网关",
  openai: "OpenAI",
  anthropic: "Anthropic",
  "google-genai": "Google GenAI",
  "openai-compatible": "OpenAI 兼容",
};

const providerColors: Record<ModelProvider, string> = {
  "ai-gateway": "blue",
  openai: "geekblue",
  anthropic: "purple",
  "google-genai": "green",
  "openai-compatible": "cyan",
};

const ModelTable = ({ models }: { models: IModel[] }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("model").delete().eq("id", id);
      if (error) {
        throw error;
      }
      message.success("模型已删除。");
      router.refresh();
    } catch {
      message.error("删除失败。");
    }
  };

  const columns: TableColumnsType<IModel> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (value: string) => (
        <span className="font-semibold text-slate-900">{value}</span>
      ),
    },
    {
      title: "供应商",
      dataIndex: "provider",
      key: "provider",
      render: (value: ModelProvider) => (
        <Tag color={providerColors[value]}>{providerLabels[value]}</Tag>
      ),
    },
    {
      title: "模型",
      dataIndex: "model",
      key: "model",
      render: (value: string) => (
        <span className="text-slate-700">{value}</span>
      ),
    },
    {
      title: "基础 URL",
      dataIndex: "baseURL",
      key: "baseURL",
      ellipsis: true,
      render: (value?: string) => value || "-",
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value?: string) =>
        value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<Pencil size={16} />}
            className="text-slate-500 hover:text-indigo-600"
            onClick={() => router.push(`/models/${record.id}/edit`)}
          />
          <Popconfirm
            title="确认删除该模型？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              icon={<Trash size={16} />}
              className="text-slate-500 hover:text-rose-500"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <Table<IModel>
        rowKey="id"
        dataSource={models}
        columns={columns}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        className="text-sm"
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-8" />
          ),
        }}
      />
    </div>
  );
};
export default ModelTable;
