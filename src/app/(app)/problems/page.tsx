export default function ProblemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Problem Tracker</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track solved, attempted, and upsolved competitive programming problems across platforms.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20">
          + Add New Problem
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <input
          type="text"
          placeholder="Search by title, key (e.g. 1850D), or tag..."
          className="flex-1 min-w-[200px] px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none">
          <option value="all">All Platforms</option>
          <option value="codeforces">Codeforces</option>
          <option value="leetcode">LeetCode</option>
          <option value="atcoder">AtCoder</option>
          <option value="cses">CSES</option>
        </select>
        <select className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="solved">Solved</option>
          <option value="upsolved">Upsolved</option>
          <option value="attempted">Attempted</option>
          <option value="todo">Todo</option>
        </select>
      </div>

      {/* Problems Empty/Placeholder State */}
      <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white">No problems tracked yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Start logging your problems and submissions to track your ratings, verdicts, and associated mistakes.
        </p>
      </div>
    </div>
  );
}
