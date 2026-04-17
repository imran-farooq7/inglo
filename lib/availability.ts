import { prisma } from '@/lib/prisma';

const RESERVATION_DURATION_MINUTES = 120;

const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60_000);

const overlapsWindow = (candidateStart: Date, candidateEnd: Date, existingStart: Date, existingEnd: Date) =>
  candidateStart < existingEnd && existingStart < candidateEnd;

const getReservationWindow = (reservationAt: Date) => ({
  start: reservationAt,
  end: addMinutes(reservationAt, RESERVATION_DURATION_MINUTES),
});

const getRequestedWindow = (reservationAtIso: string) => {
  const start = new Date(reservationAtIso);

  if (Number.isNaN(start.getTime())) {
    throw new Error('Invalid reservation date.');
  }

  return {
    start,
    end: addMinutes(start, RESERVATION_DURATION_MINUTES),
  };
};

type AvailabilityInput = {
  restaurantSlug: string;
  reservationAtIso: string;
  partySize: number;
};

export const getAvailableTables = async ({ restaurantSlug, reservationAtIso, partySize }: AvailabilityInput) => {
  const requested = getRequestedWindow(reservationAtIso);

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug },
    include: {
      tables: {
        where: {
          isActive: true,
          capacity: { gte: partySize },
        },
        orderBy: [{ capacity: 'asc' }, { name: 'asc' }],
      },
    },
  });

  if (!restaurant) {
    return { availableTables: [], unavailableTables: [], restaurantFound: false };
  }

  const tableIds = restaurant.tables.map((table) => table.id);

  const nearbyReservations = await prisma.reservation.findMany({
    where: {
      tableId: { in: tableIds },
      status: { notIn: ['cancelled', 'completed'] },
      reservationAt: {
        gte: addMinutes(requested.start, -RESERVATION_DURATION_MINUTES),
        lte: addMinutes(requested.end, RESERVATION_DURATION_MINUTES),
      },
    },
    select: {
      tableId: true,
      reservationAt: true,
    },
  });

  const conflictTableIds = new Set(
    nearbyReservations
      .filter((reservation) => {
        const existing = getReservationWindow(reservation.reservationAt);
        return overlapsWindow(requested.start, requested.end, existing.start, existing.end);
      })
      .map((reservation) => reservation.tableId),
  );

  const availableTables = restaurant.tables.filter((table) => !conflictTableIds.has(table.id));
  const unavailableTables = restaurant.tables.filter((table) => conflictTableIds.has(table.id));

  return {
    restaurantFound: true,
    availableTables,
    unavailableTables,
  };
};

export const canCreateReservation = async ({
  restaurantSlug,
  reservationAtIso,
  partySize,
  requestedTableName,
}: AvailabilityInput & { requestedTableName: string }) => {
  const availability = await getAvailableTables({ restaurantSlug, reservationAtIso, partySize });

  const table = availability.availableTables.find((item) => item.name === requestedTableName);

  return {
    ...availability,
    canReserveRequestedTable: Boolean(table),
  };
};

export { RESERVATION_DURATION_MINUTES };
