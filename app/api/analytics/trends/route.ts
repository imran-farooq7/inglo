import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { getUserRoleFromEmail } from '@/lib/roles';
import { getExclusiveEnd, getWeekBucketStart, normalizeIsoDay, validateAnalyticsQueryParams } from '@/lib/analytics/validation';

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
    const { restaurantSlug, from, to, groupBy, fromDate, toDate } = validateAnalyticsQueryParams(request.nextUrl.searchParams);

    const restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    const snapshots = await prisma.dailyKpiSnapshot.findMany({
      where: {
        restaurantId: restaurant.id,
        date: { gte: fromDate, lt: getExclusiveEnd(toDate) },
      },
      orderBy: { date: 'asc' },
      select: { date: true, totalReservations: true, avgPartySize: true },
    });

    const buckets = new Map<string, { reservations: number; avgPartySizeSum: number; days: number }>();

    snapshots.forEach((snapshot) => {
      const key = groupBy === 'week' ? normalizeIsoDay(getWeekBucketStart(snapshot.date)) : normalizeIsoDay(snapshot.date);
      const existing = buckets.get(key) ?? { reservations: 0, avgPartySizeSum: 0, days: 0 };
      existing.reservations += snapshot.totalReservations;
      existing.avgPartySizeSum += snapshot.avgPartySize;
      existing.days += 1;
      buckets.set(key, existing);
    });

    const points = [...buckets.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([periodStart, value]) => ({
        periodStart,
        totalReservations: value.reservations,
        avgPartySize: Number((value.avgPartySizeSum / value.days).toFixed(2)),
      }));

    return NextResponse.json({
      restaurant: { id: restaurant.id, slug: restaurant.slug, name: restaurant.name },
      range: { from, to, groupBy },
      points,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid analytics parameters.' },
      { status: 400 },
    );
  }
};
