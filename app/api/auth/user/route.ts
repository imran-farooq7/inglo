import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRoleFromEmail, isPremiumMember } from '@/lib/roles';

export const GET = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, role: 'guest', premium: false });
  }

  const role = getUserRoleFromEmail(user.email);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
    role,
    premium: isPremiumMember(user.email),
  });
};
