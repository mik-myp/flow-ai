"use client";
import EmEmoji from "@/components/emoji/EmEmoji";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { Pencil, Trash } from "lucide-react";
import { Button, Flex, Popconfirm, Tag, Tooltip, Typography } from "antd";
const { Text } = Typography;

export interface IWorkFlow {
  id: string;
  created_at: string;
  icon: string;
  name: string;
  description: string;
  updated_at: string;
  tags: string[];
  user_id: string;
}

export default function WorkFlowCards({
  workflows,
}: {
  workflows: IWorkFlow[];
}) {
  const router = useRouter();

  console.log(
    "🚀 ~ work-flow-info.tsx:7 ~ WorkFlowInfo ~ workflows:",
    workflows,
  );

  return (
    <div className="2k:grid-cols-6 relative mb-4 grid grow grid-cols-1 content-start gap-x-6 gap-y-8 px-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {workflows.map((item) => (
        <div
          key={item.id}
          onClick={() => router.push(`/workFlow/${item.id}`)}
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
                  // onEdit();
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title="确认删除？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  // onDelete();
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
