export function StockSearchSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="h-8 bg-slate-200 rounded w-48 mb-6 animate-pulse" />
      <div className="h-12 bg-slate-200 rounded mb-6 animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-48 mb-3 animate-pulse" />
                <div className="h-8 bg-slate-200 rounded w-32 animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
