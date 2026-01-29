"use client";

import EmEmoji from "@/components/emoji/EmEmoji";
import type { IWorkFlow } from "@/types/workflow";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";
import { Button, message, Popconfirm, Tag, Tooltip } from "antd";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

function WorkFlowCard({ item }: { item: IWorkFlow }) {
  const router = useRouter();
  const supabase = createClient();
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("work_flow")
        .delete()
        .eq("id", item.id);
      if (error) {
        throw error;
      }
      message.success("工作流已删除。");
      router.refresh();
      setPopconfirmOpen(false);
    } catch {
      message.error("删除失败。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/workflows/${item.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          router.push(`/workflows/${item.id}`);
        }
      }}
      className="group flex min-h-45 cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-amber-100 text-[22px]">
            <EmEmoji id={item.icon} />
          </span>
          <div>
            <div className="text-base font-semibold text-slate-900">
              {item.name}
            </div>
            <div className="text-xs text-slate-500">
              更新于 {dayjs(item.updated_at).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 transition ${
            popconfirmOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<Pencil size={16} />}
              className="text-slate-500 hover:text-indigo-600"
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/workflows/${item.id}/edit`);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确认删除该工作流？"
              open={popconfirmOpen}
              onOpenChange={setPopconfirmOpen}
              okButtonProps={{ loading: isDeleting }}
              onConfirm={(event) => {
                event?.stopPropagation();
                handleDelete();
              }}
              onCancel={(event) => {
                event?.stopPropagation();
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<Trash size={16} />}
                loading={isDeleting}
                disabled={isDeleting}
                className="text-slate-500 hover:text-rose-500"
                onClick={(event) => event.stopPropagation()}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      </div>

      <p className="min-h-5 text-sm text-slate-600">{item.description || ""}</p>

      <div className="flex min-h-5.5 flex-wrap gap-2">
        {item.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
}

export default function WorkFlowCards({
  workflows,
}: {
  workflows: IWorkFlow[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {workflows.map((item) => (
        <WorkFlowCard key={item.id} item={item} />
      ))}
    </div>
  );
}
