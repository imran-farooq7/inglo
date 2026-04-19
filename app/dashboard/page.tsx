import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReservationBoard } from '@/components/dashboard/reservation-board';

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <>
      <section className="section">
        <h1>Operations Dashboard</h1>
        <p className="subtitle">Welcome back, {user.email}. Manage daily floor flow below.</p>
        <div className="badges">
          <span className="badge">Module 4 active</span>
          <span className="badge">Table board</span>
          <span className="badge">Status controls</span>
        </div>
      </section>
      <ReservationBoard />
    </>
  );
};

export default DashboardPage;
