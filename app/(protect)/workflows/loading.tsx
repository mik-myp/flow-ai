export default function WorkflowsLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 bg-white px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 w-40 rounded-full bg-slate-200" />
          <div className="mt-1 h-5 w-64 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`workflow-skeleton-${index}`}
              className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                    <div className="h-3 w-40 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded-full bg-slate-200" />
                <div className="h-3 w-3/4 rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-slate-200" />
                <div className="h-6 w-12 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
