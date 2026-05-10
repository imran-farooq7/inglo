import { prisma } from '@/lib/prisma';

type SnapshotMetrics = {
  restaurantId: string;
  date: Date;
  totalReservations: number;
  confirmedCount: number;
  seatedCount: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
  avgPartySize: number;
  bookingTypeBreakdown: Record<string, number>;
};

const toUtcDay = (dateString: string) => {
  const day = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(day.getTime())) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD.');
  }

  return day;
};

const getDayBounds = (day: Date) => {
  const start = new Date(day);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

const initBookingTypeBreakdown = (): Record<string, number> => ({
  guest: 0,
  logged_in: 0,
  staff: 0,
  premium: 0,
});

export const computeDailySnapshotMetrics = async (restaurantId: string, date: string): Promise<SnapshotMetrics> => {
  const day = toUtcDay(date);
  const { start, end } = getDayBounds(day);

  const reservations = await prisma.reservation.findMany({
    where: {
      restaurantId,
      reservationAt: {
        gte: start,
        lt: end,
      },
    },
    select: {
      bookingType: true,
      status: true,
      partySize: true,
    },
  });

  const bookingTypeBreakdown = initBookingTypeBreakdown();
  const statusCounts: Record<string, number> = {
    confirmed: 0,
    seated: 0,
    completed: 0,
    cancelled: 0,
  };

  let totalPartySize = 0;

  reservations.forEach((reservation) => {
    bookingTypeBreakdown[reservation.bookingType] += 1;
    statusCounts[reservation.status] += 1;
    totalPartySize += reservation.partySize;
  });

  return {
    restaurantId,
    date: start,
    totalReservations: reservations.length,
    confirmedCount: statusCounts.confirmed,
    seatedCount: statusCounts.seated,
    completedCount: statusCounts.completed,
    cancelledCount: statusCounts.cancelled,
    noShowCount: 0,
    avgPartySize: reservations.length === 0 ? 0 : totalPartySize / reservations.length,
    bookingTypeBreakdown,
  };
};

export const rebuildDailySnapshots = async (restaurantId: string, startDate: string, endDate: string) => {
  const start = toUtcDay(startDate);
  const end = toUtcDay(endDate);

  if (end < start) {
    throw new Error('endDate must be greater than or equal to startDate.');
  }

  const snapshots: SnapshotMetrics[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const dayString = cursor.toISOString().slice(0, 10);
    const metrics = await computeDailySnapshotMetrics(restaurantId, dayString);

    snapshots.push(metrics);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  await prisma.$transaction(
    snapshots.map((snapshot) =>
      prisma.dailyKpiSnapshot.upsert({
        where: {
          restaurantId_date: {
            restaurantId: snapshot.restaurantId,
            date: snapshot.date,
          },
        },
        create: snapshot,
        update: snapshot,
      }),
    ),
  );

  return snapshots;
};
