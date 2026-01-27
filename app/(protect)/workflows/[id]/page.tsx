import { getWorkflowByIdServer } from "@/lib/supabase/queries";
import {
  ChevronRight,
  Database,
  Play,
  Sparkles,
  SquareTerminal,
} from "lucide-react";
import Link from "next/link";

const canvasNodes = [
  {
    title: "开始",
    description: "从 API、聊天或定时任务触发。",
    icon: Play,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "提示词",
    description: "构建系统指令与输入。",
    icon: Sparkles,
    tone: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "知识库",
    description: "连接数据源进行检索。",
    icon: Database,
    tone: "bg-sky-50 text-sky-600",
  },
  {
    title: "代码",
    description: "用自定义逻辑处理输出。",
    icon: SquareTerminal,
    tone: "bg-amber-50 text-amber-600",
  },
];

export default async function WorkflowDetail({
  params,
}: {
  params: { id: string };
}) {
  const data = await getWorkflowByIdServer(params.id);

  const workflowName = data?.name || "未命名工作流";
  const workflowDescription = data?.description || "为该工作流定义步骤和逻辑。";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <div className="border-b border-slate-200/70 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/workflows" className="hover:text-indigo-600">
                工作流
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-slate-700">{workflowName}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                {workflowName}
              </h1>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                草稿
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{workflowDescription}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              分享
            </button>
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              运行工作流
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-slate-200/70 bg-white p-4">
          <div className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
            模块
          </div>
          <div className="mt-4 space-y-3">
            {canvasNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${node.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold">{node.title}</div>
                    <div className="text-xs text-slate-500">
                      {node.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="relative flex-1 overflow-auto bg-slate-50">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto flex min-h-full max-w-5xl flex-col gap-6 p-8">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">
                工作流画布
              </div>
              <p className="mt-1 text-sm text-slate-500">
                从左侧拖拽模块构建工作流步骤。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {canvasNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={`canvas-${node.title}`}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${node.tone}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {node.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {node.description}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                      连接节点以定义数据流。
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="w-80 shrink-0 border-l border-slate-200/70 bg-white p-5">
          <div className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
            属性面板
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                状态
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                草稿进行中
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm text-slate-600">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                详情
              </div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>版本</span>
                  <span className="font-medium text-slate-900">v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>更新时间</span>
                  <span className="font-medium text-slate-900">
                    {data?.updated_at
                      ? new Date(data.updated_at).toLocaleString("zh-CN")
                      : "刚刚"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>负责人</span>
                  <span className="font-medium text-slate-900">我</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              打开设置
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
