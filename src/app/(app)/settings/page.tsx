import { createClient } from '@/lib/supabase/server';

export const instant = false;

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .maybeSingle();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your CP platform handles, daily goals, and target ratings.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Account Email
          </label>
          <input
            type="text"
            disabled
            value={user?.email || ''}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Codeforces Handle
            </label>
            <input
              type="text"
              defaultValue={profile?.codeforces_handle || ''}
              placeholder="e.g. tourist"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              LeetCode Handle
            </label>
            <input
              type="text"
              defaultValue={profile?.leetcode_handle || ''}
              placeholder="e.g. neetcode"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Daily Problem Target
            </label>
            <input
              type="number"
              defaultValue={profile?.daily_target ?? 3}
              min={0}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Preferred Language
            </label>
            <select
              defaultValue={profile?.preferred_language || 'cpp'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cpp">C++ (GCC 20 / 23)</option>
              <option value="python">Python 3 / PyPy</option>
              <option value="java">Java 21</option>
              <option value="rust">Rust</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="mt-2 py-2.5 px-5 rounded-xl font-medium text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
