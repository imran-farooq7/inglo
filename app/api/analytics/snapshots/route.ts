import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rebuildDailySnapshots } from '@/lib/analytics/aggregation';
import { createClient } from '@/lib/supabase/server';
import { getUserRoleFromEmail } from '@/lib/roles';

const ensureStaff = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getUserRoleFromEmail(user?.email);

  if (!user || role !== 'staff') {
    return false;
  }

  return true;
};

export const POST = async (request: NextRequest) => {
  const allowed = await ensureStaff();

  if (!allowed) {
    return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  }

  const body = (await request.json()) as {
    restaurantSlug?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!body.restaurantSlug || !body.startDate || !body.endDate) {
    return NextResponse.json({ error: 'restaurantSlug, startDate, and endDate are required.' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { slug: body.restaurantSlug } });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
  }

  try {
    const snapshots = await rebuildDailySnapshots(restaurant.id, body.startDate, body.endDate);

    return NextResponse.json({
      restaurantId: restaurant.id,
      startDate: body.startDate,
      endDate: body.endDate,
      snapshotCount: snapshots.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to rebuild analytics snapshots.' },
      { status: 400 },
    );
  }
};
