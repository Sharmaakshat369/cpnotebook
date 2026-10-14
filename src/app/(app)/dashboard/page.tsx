import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Competitive Programming Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Transform every failed attempt into reusable knowledge and algorithmic reflexes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            + Log Problem
          </Link>
          <Link
            href="/mistakes"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            + Log Mistake
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Problems Solved</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">0</span>
            <span className="text-xs text-emerald-400 font-medium">Ready to track</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mistakes Cataloged</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">0</span>
            <span className="text-xs text-slate-500 font-medium">Actionable insights</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">WHEN → DO Patterns</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">0</span>
            <span className="text-xs text-slate-500 font-medium">Heuristics active</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Revisions Due</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-400">0</span>
            <span className="text-xs text-purple-400 font-medium">Spaced repetition</span>
          </div>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weakness Alert Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Weakness Analysis
            </h2>
            <Link href="/mistakes" className="text-xs text-blue-400 hover:text-blue-300">View Library →</Link>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Record your failed attempts with specific verdicts (WA, TLE, MLE, RE). Our weakness analytics will aggregate your most frequent failure patterns by category (overflows, edge cases, greedy assumptions).
          </p>
        </div>

        {/* Pattern Quick View */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              WHEN YOU SEE → THINK → DO
            </h2>
            <Link href="/patterns" className="text-xs text-amber-400 hover:text-amber-300">Explore Patterns →</Link>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            CP mastery is about fast pattern matching. Build your catalog of cues (e.g. &ldquo;Find min maximum&rdquo; → Binary Search on Answer → Write monotonic check function).
          </p>
        </div>
      </div>
    </div>
  );
}
