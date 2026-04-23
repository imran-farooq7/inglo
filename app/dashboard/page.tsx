import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReservationBoard } from '@/components/dashboard/reservation-board';
import { getUserRoleFromEmail } from '@/lib/roles';

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const role = getUserRoleFromEmail(user.email);

  if (role !== 'staff') {
    redirect('/reservations');
  }

  return (
    <>
      <section className="section">
        <h1>Operations Dashboard</h1>
        <p className="subtitle">Welcome back, {user.email}. Staff tools are enabled for this account.</p>
        <div className="badges">
          <span className="badge">Module 5 active</span>
          <span className="badge">Role: staff</span>
          <span className="badge">Premium rules active</span>
        </div>
      </section>
      <ReservationBoard />
    </>
  );
};

export default DashboardPage;
