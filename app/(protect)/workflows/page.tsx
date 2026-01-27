import React from "react";
import WorkFlowCards from "./_components/WorkFlowCards";
import { getUserWorkflowsServer } from "@/lib/supabase/queries";
import { Workflow } from "lucide-react";
import Link from "next/link";

const WorkFlows: React.FC = async () => {
  const workflows = await getUserWorkflowsServer();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 bg-white px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">工作流</h1>
            <p className="mt-1 text-sm text-slate-500">
              创建、管理、运行工作流
            </p>
          </div>
          <Link
            href="/workflows/new"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            创建工作流
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {workflows.length > 0 ? (
          <WorkFlowCards workflows={workflows} />
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Workflow className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              还没有工作流
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              创建第一个工作流，开始构建 AI 自动化。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkFlows;
