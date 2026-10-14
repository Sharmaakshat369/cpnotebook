export default function MistakesPage() {
  const categories = [
    { id: 'logic_algorithm', label: 'Logic & Algorithm', color: 'text-amber-400 border-amber-500/30' },
    { id: 'edge_case', label: 'Edge & Corner Cases', color: 'text-blue-400 border-blue-500/30' },
    { id: 'implementation_syntax', label: 'Implementation', color: 'text-indigo-400 border-indigo-500/30' },
    { id: 'overflow_precision', label: 'Overflow & Precision', color: 'text-rose-400 border-rose-500/30' },
    { id: 'complexity_tle_mle', label: 'Complexity (TLE/MLE)', color: 'text-purple-400 border-purple-500/30' },
    { id: 'contest_strategy', label: 'Contest Strategy', color: 'text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mistake Library</h1>
          <p className="text-sm text-slate-400 mt-1">
            Every failed competitive programming attempt becomes reusable knowledge with prevention checklists.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/20">
          + Log Mistake Entry
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border ${cat.color} cursor-pointer hover:bg-slate-800 transition-colors`}
          >
            {cat.label}
          </span>
        ))}
      </div>

      {/* Mistakes Empty State */}
      <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-rose-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">No mistakes recorded yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Catalog recurring traps (e.g. 32-bit int overflow on prefix sum, missing N=1 edge check, multi-testcase memset) to prevent making them in contests.
        </p>
      </div>
    </div>
  );
}
