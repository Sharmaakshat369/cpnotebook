export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Revision Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            Spaced repetition (SM-2) system to upsolve failed problems and cement tricky mistake patterns.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          0 Items Due Today
        </div>
      </div>

      <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-purple-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">All caught up!</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          When you fail a problem attempt or log a high-severity mistake, schedule it for review at spaced intervals (1 day, 3 days, 7 days, 21 days).
        </p>
      </div>
    </div>
  );
}
