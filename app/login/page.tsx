import { ShieldCheck, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";
import SignupForm from "./_components/SignupForm";

const highlights = [
  {
    title: "可视化编排",
    description: "拖拽式组合步骤，便于协作与迭代。",
    icon: Workflow,
  },
  {
    title: "统一模型管理",
    description: "集中配置供应商与凭据，便于切换与治理。",
    icon: Sparkles,
  },
  {
    title: "权限与安全",
    description: "关键配置可控，适配团队使用。",
    icon: ShieldCheck,
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-svh bg-slate-950">
      <div className="grid min-h-svh lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-400 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-500 blur-3xl" />
          </div>
          <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
            <Link href="/login" className="flex items-center gap-2 text-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <Workflow className="h-5 w-5" />
              </span>
              <span className="font-semibold text-white">Flow AI</span>
            </Link>

            <div>
              <h1 className="text-4xl leading-tight font-semibold">
                专注构建清晰的 AI 工作流
              </h1>
              <p className="mt-4 max-w-md text-sm text-white/80">
                Flow AI 提供可视化编排与模型管理。
              </p>

              <div className="mt-8 space-y-5">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold">
                          {item.title}
                        </div>
                        <div className="text-xs text-white/70">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50 px-6 py-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">登录</h2>
            <p className="mb-6 text-sm text-slate-500">
              使用 GitHub 登录工作区。
            </p>
            <div className="mb-6">
              <SignupForm />
            </div>
            <p className="text-xs text-slate-400">
              登录即表示你同意团队工作区政策。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
