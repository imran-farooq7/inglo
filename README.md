# Inglo Smart Reservations (Module-Based Build)

## Progress summary before Module 3
- ✅ Module 1 completed: foundation, marketing, reservations API, Prisma and Supabase baseline.
- ✅ Module 2 completed: Supabase auth flows, protected dashboard, auth-aware reservation UX.

## Progress summary after Module 3
- ✅ Smart availability engine with fixed reservation windows.
- ✅ Conflict detection to prevent overlapping reservations on the same table.
- ✅ Availability API endpoint (`/api/availability`) for real-time table lookup.
- ✅ Reservation API now rejects double-bookings and capacity mismatches.
- ✅ Reservation form now loads/updates available tables by party size + datetime.

---

## Structure and where each component is used

- `lib/availability.ts`
  - Core functional availability logic:
    - computes 2-hour windows,
    - finds overlapping reservations,
    - returns available/unavailable tables,
    - checks if requested table can be reserved.
- `app/api/availability/route.ts`
  - Read endpoint for frontend availability queries.
- `app/api/reservations/route.ts`
  - Create endpoint now enforces capacity + overlap safety via availability module.
- `components/reservation-form.tsx`
  - Client flow for live availability:
    - query `/api/availability` when date/party changes,
    - render only available tables,
    - prevent submit when no table is available.

(Everything from Modules 1 and 2 remains active, including auth, dashboard, and marketing pages.)

---

## Current module roadmap

1. ✅ Module 1: foundation, marketing pages, reservation CRUD entrypoint.
2. ✅ Module 2: authentication (guest vs logged-in), Supabase auth flows.
3. ✅ Module 3: smart table availability engine and conflict checking.
4. ⏳ Module 4: restaurant dashboard reservation calendar/table management.
5. ⏳ Module 5: role-based staff tools and premium booking rules.
6. ⏳ Module 6: analytics and optimization suggestions.

---

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Run Prisma generate + migration + seed:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Start app:
   ```bash
   npm run dev
   ```

Open:
- `http://localhost:3000/`
- `http://localhost:3000/reservations`
- `http://localhost:3000/dashboard`
