import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTables, RESERVATION_DURATION_MINUTES } from '@/lib/availability';

const getQuery = (request: NextRequest, key: string) => request.nextUrl.searchParams.get(key) ?? '';

export const GET = async (request: NextRequest) => {
  const restaurantSlug = getQuery(request, 'restaurantSlug');
  const reservationAt = getQuery(request, 'reservationAt');
  const partySize = Number(getQuery(request, 'partySize') || 0);

  if (!restaurantSlug || !reservationAt || !partySize || Number.isNaN(partySize)) {
    return NextResponse.json(
      { error: 'restaurantSlug, reservationAt, and partySize are required.' },
      { status: 400 },
    );
  }

  try {
    const availability = await getAvailableTables({
      restaurantSlug,
      reservationAtIso: reservationAt,
      partySize,
    });

    if (!availability.restaurantFound) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    return NextResponse.json({
      reservationDurationMinutes: RESERVATION_DURATION_MINUTES,
      availableTables: availability.availableTables,
      unavailableTables: availability.unavailableTables,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid reservationAt value.' }, { status: 400 });
  }
};
