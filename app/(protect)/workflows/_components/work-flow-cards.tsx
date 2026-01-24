"use client";
import EmEmoji from "@/components/emoji/EmEmoji";
import { useRouter } from "next/navigation";
import React from "react";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkFlowCards({ workflows }: { workflows: any[] }) {
  const router = useRouter();

  console.log(
    "🚀 ~ work-flow-info.tsx:7 ~ WorkFlowInfo ~ workflows:",
    workflows,
  );

  return (
    <div className="2k:grid-cols-6 relative mb-4 grid grow grid-cols-1 content-start gap-x-6 gap-y-8 px-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {workflows.map((item) => (
        <div
          onClick={() => router.push(`/workflows/${item.id}`)}
          className="flex h-50 cursor-pointer flex-col justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-md hover:shadow-lg"
          key={item.id}
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
              <div className="text-[18px]! font-bold text-[#1E293B]!">
                {item.name}
              </div>
              <div className="text-[12px] text-[#94A3B8]">
                编辑于：{dayjs(item.updateTime).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
          </div>
          <div className="min-h-5.5 text-[14px]! text-[#64748B]!">
            {item.description}
          </div>

          <div className="flex min-h-5.5 items-center gap-2 overflow-x-hidden text-[10px] leading-3">
            {item.tags?.map((tag: string) => {
              return (
                <div key={tag} className="rounded-[5px] border px-1.25 py-0.75">
                  {tag}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} variant={"link"}>
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>编辑</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} variant={"link"}>
                  <Trash size={16} color="red" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>删除</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
