import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'inglo-demo' },
    update: { name: 'Inglo Demo Restaurant' },
    create: {
      slug: 'inglo-demo',
      name: 'Inglo Demo Restaurant',
      tables: {
        createMany: {
          data: [
            { name: 'T1', capacity: 2 },
            { name: 'T2', capacity: 4 },
            { name: 'T3', capacity: 6 },
          ],
        },
      },
    },
  });

  const existingCount = await prisma.reservation.count({ where: { restaurantId: restaurant.id } });

  if (existingCount === 0) {
    const table = await prisma.table.findFirstOrThrow({
      where: { restaurantId: restaurant.id, name: 'T1' },
    });

    await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        tableId: table.id,
        bookingType: 'guest',
        guestName: 'Seed Guest',
        guestEmail: 'seed@inglo.app',
        partySize: 2,
        reservationAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        notes: 'Initial seeded reservation',
      },
    });
  }
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
