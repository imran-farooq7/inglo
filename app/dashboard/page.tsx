import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <section className="section">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome back, {user.email}.</p>
      <div className="badges">
        <span className="badge">Role: staff-ready</span>
        <span className="badge">Auth: Supabase SSR</span>
        <span className="badge">Module 2 complete</span>
      </div>
    </section>
  );
};

export default DashboardPage;
