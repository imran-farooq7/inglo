-- CreateTable
CREATE TABLE "DailyKpiSnapshot" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalReservations" INTEGER NOT NULL,
    "confirmedCount" INTEGER NOT NULL,
    "seatedCount" INTEGER NOT NULL,
    "completedCount" INTEGER NOT NULL,
    "cancelledCount" INTEGER NOT NULL,
    "noShowCount" INTEGER NOT NULL DEFAULT 0,
    "avgPartySize" DOUBLE PRECISION NOT NULL,
    "bookingTypeBreakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyKpiSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyKpiSnapshot_restaurantId_date_idx" ON "DailyKpiSnapshot"("restaurantId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyKpiSnapshot_restaurantId_date_key" ON "DailyKpiSnapshot"("restaurantId", "date");

-- AddForeignKey
ALTER TABLE "DailyKpiSnapshot" ADD CONSTRAINT "DailyKpiSnapshot_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
