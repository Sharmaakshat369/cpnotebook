import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/navigation/sidebar';

export const instant = false;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch optional profile info
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, codeforces_handle')
    .eq('id', user.id)
    .maybeSingle();

  const displayName = profile?.display_name || profile?.username || user.user_metadata?.full_name || user.user_metadata?.username;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#090d16]">
      <Sidebar userEmail={user.email} userName={displayName} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
