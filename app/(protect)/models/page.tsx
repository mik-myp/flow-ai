import React from "react";
import { getUserModelsServer } from "@/lib/supabase/queries";
import ModelTable from "./_components/ModelTable";
import Link from "next/link";

const Models: React.FC = async () => {
  const models = await getUserModelsServer();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 bg-white px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">模型库</h1>
            <p className="mt-1 text-sm text-slate-500">
              管理工作流所需的模型供应商与凭据。
            </p>
          </div>
          <Link
            href="/models/new"
            className="rounded-full bg-indigo-600! px-4 py-2 text-sm font-semibold text-white! shadow-sm transition hover:bg-indigo-500!"
          >
            添加模型
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <ModelTable models={models} />
      </div>
    </div>
  );
};

export default Models;
