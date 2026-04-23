import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reservationInputSchema } from '@/lib/reservation-schema';
import { canCreateReservation } from '@/lib/availability';
import { createClient } from '@/lib/supabase/server';
import { canUsePremiumBooking, getUserRoleFromEmail } from '@/lib/roles';

const getTableForRestaurant = async (restaurantSlug: string, tableName: string) =>
  prisma.table.findFirst({
    where: {
      name: tableName,
      restaurant: { slug: restaurantSlug },
    },
    include: { restaurant: true },
  });

const getAuthContext = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user,
    role: getUserRoleFromEmail(user?.email),
  };
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsedResult = reservationInputSchema.safeParse(body);

  if (!parsedResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid reservation payload.',
        details: parsedResult.error.issues,
      },
      { status: 400 },
    );
  }

  const payload = parsedResult.data;
  const auth = await getAuthContext();

  if (payload.bookingType === 'staff' && auth.role !== 'staff') {
    return NextResponse.json({ error: 'Staff booking type requires a staff account.' }, { status: 403 });
  }

  if (payload.bookingType === 'premium') {
    const premiumAccess = canUsePremiumBooking({
      email: auth.user?.email,
      reservationAt: new Date(payload.reservationAt),
    });

    if (!premiumAccess.allowed) {
      return NextResponse.json({ error: premiumAccess.reason }, { status: 403 });
    }
  }

  const table = await getTableForRestaurant(payload.restaurantSlug, payload.tableName);

  if (!table) {
    return NextResponse.json({ error: 'Table not found for restaurant.' }, { status: 404 });
  }

  if (payload.partySize > table.capacity) {
    return NextResponse.json(
      { error: `Selected table capacity (${table.capacity}) is lower than party size (${payload.partySize}).` },
      { status: 409 },
    );
  }

  const availability = await canCreateReservation({
    restaurantSlug: payload.restaurantSlug,
    reservationAtIso: payload.reservationAt,
    partySize: payload.partySize,
    requestedTableName: payload.tableName,
  });

  if (!availability.canReserveRequestedTable) {
    return NextResponse.json(
      {
        error: 'Requested table is unavailable for this time window.',
        availableTables: availability.availableTables,
      },
      { status: 409 },
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      restaurantId: table.restaurantId,
      tableId: table.id,
      bookingType: payload.bookingType,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      partySize: payload.partySize,
      reservationAt: new Date(payload.reservationAt),
      notes: payload.notes,
      status: 'confirmed',
    },
  });

  return NextResponse.json({ reservationId: reservation.id, status: reservation.status });
};

export const GET = async () => {
  const reservations = await prisma.reservation.findMany({
    orderBy: { reservationAt: 'asc' },
    take: 100,
    include: {
      table: {
        include: { restaurant: true },
      },
    },
  });

  return NextResponse.json({ reservations });
};
