import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

const getDateRange = (dateString?: string | null) => {
  const base = dateString ? new Date(`${dateString}T00:00:00.000Z`) : new Date();

  if (Number.isNaN(base.getTime())) {
    throw new Error('Invalid date');
  }

  const start = new Date(base);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

export const GET = async (request: NextRequest) => {
  const allowed = await ensureStaff();

  if (!allowed) {
    return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  }

  const restaurantSlug = request.nextUrl.searchParams.get('restaurantSlug') ?? 'inglo-demo';
  const date = request.nextUrl.searchParams.get('date');

  try {
    const { start, end } = getDateRange(date);

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
      include: {
        tables: {
          where: { isActive: true },
          orderBy: [{ capacity: 'asc' }, { name: 'asc' }],
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        reservationAt: { gte: start, lt: end },
      },
      orderBy: [{ reservationAt: 'asc' }, { createdAt: 'asc' }],
      include: { table: true },
    });

    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
      },
      date: start.toISOString().slice(0, 10),
      tables: restaurant.tables,
      reservations,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid date filter.' }, { status: 400 });
  }
};

export const PATCH = async (request: NextRequest) => {
  const allowed = await ensureStaff();

  if (!allowed) {
    return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  }

  const body = (await request.json()) as { reservationId?: string; status?: string };

  if (!body.reservationId || !body.status) {
    return NextResponse.json({ error: 'reservationId and status are required.' }, { status: 400 });
  }

  const allowedStatuses = ['confirmed', 'seated', 'completed', 'cancelled'] as const;

  if (!allowedStatuses.includes(body.status as (typeof allowedStatuses)[number])) {
    return NextResponse.json({ error: 'Unsupported status.' }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { id: body.reservationId },
      data: { status: body.status as (typeof allowedStatuses)[number] },
    });

    return NextResponse.json({ reservationId: reservation.id, status: reservation.status });
  } catch {
    return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
  }
};
