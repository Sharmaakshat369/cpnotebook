export default function PatternsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-2">
            Heuristic Framework
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WHEN YOU SEE → THINK → DO</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build instant algorithmic reflexes by connecting problem cues directly to proven techniques and code templates.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md shadow-amber-600/20">
          + Add Pattern
        </button>
      </div>

      {/* Pattern Card Example Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Binary Search
            </span>
            <h3 className="text-base font-bold text-white">Binary Search on Monotonic Answer Range</h3>
          </div>
          <span className="text-xs text-slate-500">Confidence: 4/5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              WHEN YOU SEE
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              &ldquo;Find the minimum maximum&rdquo;, or problem checks whether an answer $X$ is feasible with a monotonic check function.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
              THINK
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Do not construct the optimal answer directly. Guess $X$ and check feasibility in $O(N)$ with a greedy or two-pointer predicate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              DO
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Define `bool check(mid)`; establish search range $[L, R]$; loop with `mid = L + (R - L) / 2` to avoid 32-bit overflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
