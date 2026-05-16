import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { getUserRoleFromEmail } from '@/lib/roles';
import { getExclusiveEnd, validateAnalyticsQueryParams } from '@/lib/analytics/validation';

const ensureStaff = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getUserRoleFromEmail(user?.email);

  return Boolean(user && role === 'staff');
};

export const GET = async (request: NextRequest) => {
  const allowed = await ensureStaff();

  if (!allowed) {
    return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  }

  try {
    const { restaurantSlug, from, to, fromDate, toDate } = validateAnalyticsQueryParams(request.nextUrl.searchParams);

    const restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        reservationAt: { gte: fromDate, lt: getExclusiveEnd(toDate) },
      },
      select: { bookingType: true },
    });

    const distribution = { guest: 0, logged_in: 0, staff: 0, premium: 0 };

    reservations.forEach((reservation) => {
      distribution[reservation.bookingType] += 1;
    });

    const total = reservations.length;
    const mix = Object.entries(distribution).map(([bookingType, count]) => ({
      bookingType,
      count,
      percent: total === 0 ? 0 : Number(((count / total) * 100).toFixed(2)),
    }));

    return NextResponse.json({
      restaurant: { id: restaurant.id, slug: restaurant.slug, name: restaurant.name },
      range: { from, to },
      total,
      mix,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid analytics parameters.' },
      { status: 400 },
    );
  }
};
