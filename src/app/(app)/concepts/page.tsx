export default function ConceptsPage() {
  const sampleConcepts = [
    { name: 'Segment Tree with Lazy Propagation', category: 'Data Structures', mastery: 'practicing', time: 'O(log N)' },
    { name: 'Disjoint Set Union (DSU)', category: 'Data Structures', mastery: 'mastered', time: 'O(alpha(N))' },
    { name: 'Binary Lifting (LCA)', category: 'Trees & Graphs', mastery: 'learning', time: 'O(log N)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Concept Library</h1>
          <p className="text-sm text-slate-400 mt-1">
            Data structures, graph algorithms, and competitive programming templates.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20">
          + Add Concept
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleConcepts.map((c) => (
          <div key={c.name} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{c.category}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {c.mastery}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{c.name}</h3>
            <div className="text-xs text-slate-500">Query / Update: <code className="text-slate-300 font-mono">{c.time}</code></div>
          </div>
        ))}
      </div>
    </div>
  );
}
