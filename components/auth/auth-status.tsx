import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/auth/actions';

export const AuthStatus = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="badges" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Link href="/auth/sign-in" className="badge">
          Sign in
        </Link>
        <Link href="/auth/sign-up" className="badge">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="badges" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
      <span className="badge">{user.email}</span>
      <Link href="/dashboard" className="badge">
        Dashboard
      </Link>
      <form action={signOutAction}>
        <button className="badge" type="submit" style={{ cursor: 'pointer' }}>
          Sign out
        </button>
      </form>
    </div>
  );
};
