import { z } from 'zod';

export const bookingTypes = ['guest', 'logged_in', 'staff', 'premium'] as const;

export const reservationInputSchema = z.object({
  restaurantSlug: z.string().min(2),
  tableName: z.string().min(1),
  bookingType: z.enum(bookingTypes),
  guestName: z.string().min(2),
  guestEmail: z.email(),
  partySize: z.int().min(1).max(20),
  reservationAt: z.iso.datetime(),
  notes: z.string().max(500).optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;
