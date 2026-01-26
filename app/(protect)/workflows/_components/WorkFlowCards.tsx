"use client";
import EmEmoji from "@/components/emoji/EmEmoji";
import type { IWorkFlow } from "@/types/workflow";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { Pencil, Trash } from "lucide-react";
import {
  Button,
  Flex,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { createClient } from "@/lib/supabase/client";

const { Text } = Typography;

export default function WorkFlowCards({
  workflows,
}: {
  workflows: IWorkFlow[];
}) {
  const router = useRouter();

  const supabase = createClient();

  const handleDelete = async (item: IWorkFlow) => {
    try {
      const { error } = await supabase
        .from("work_flow")
        .delete()
        .eq("id", item.id);
      if (error) {
        throw error;
      }
      message.success("工作流删除成功.");
      router.refresh();
    } catch {
      console.log("删除失败.");
    }
  };

  return (
    <div className="2k:grid-cols-6 relative mb-4 grid grow grid-cols-1 content-start gap-x-6 gap-y-8 px-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {workflows.map((item) => (
        <div
          key={item.id}
          onClick={() => router.push(`/workflows/${item.id}`)}
          className="flex h-50 cursor-pointer flex-col justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span
              className="relative flex h-10 w-10 shrink-0 grow-0 items-center justify-center overflow-hidden rounded-[10px] border-[0.5px] border-[#10182814] text-[24px]"
              style={{
                background: "#ffead5",
              }}
            >
              <EmEmoji id={item.icon} />
            </span>

            <div>
              <Text
                ellipsis={{
                  tooltip: true,
                }}
                className="text-[18px]! font-bold text-[#1E293B]!"
              >
                {item.name}
              </Text>
              <div className="text-[12px] text-[#94A3B8]">
                编辑于：{dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
          </div>
          <Text
            ellipsis={{
              tooltip: true,
            }}
            className="min-h-5.5 text-[14px]! text-[#64748B]!"
          >
            {item.description}
          </Text>

          <Flex
            gap="small"
            align="center"
            className="flex! min-h-5.5 overflow-x-hidden"
          >
            {item.tags?.map((tag) => {
              return <Tag key={tag}>{tag}</Tag>;
            })}
          </Flex>
          <Flex gap="small" align="center" justify="end">
            <Tooltip title="编辑">
              <Button
                icon={<Pencil size={16} />}
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/workflows/${item.id}/edit`);
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title="确认删除？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDelete(item);
                }}
              >
                <Button
                  icon={<Trash size={16} />}
                  type="link"
                  danger
                  onClick={(e) => e.stopPropagation()}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Flex>
        </div>
      ))}
    </div>
  );
}
