export default function ModelsLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 bg-white px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded-full bg-slate-200" />
            <div className="mt-1 h-5 w-72 rounded-full bg-slate-200" />
          </div>
          <div className="h-9 w-28 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="animate-pulse">
            <div className="grid grid-cols-6 gap-4 border-b border-slate-200/70 bg-slate-50 px-4 py-4.75">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`model-header-skeleton-${index}`}
                  className="h-4 w-24 rounded-full bg-slate-200"
                />
              ))}
            </div>
            <div className="divide-y divide-slate-200/70">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`model-row-skeleton-${index}`}
                  className="grid grid-cols-6 gap-4 px-4 py-4"
                >
                  <div className="h-4 w-32 rounded-full bg-slate-200" />
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-28 rounded-full bg-slate-200" />
                  <div className="h-4 w-full rounded-full bg-slate-200" />
                  <div className="h-4 w-28 rounded-full bg-slate-200" />
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-200" />
                    <div className="h-6 w-6 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
