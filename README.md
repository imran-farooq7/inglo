# Inglo Smart Reservations (Module-Based Build)

## Progress summary before Module 4
- ✅ Module 1 completed: foundation, marketing, reservations API, Prisma and Supabase baseline.
- ✅ Module 2 completed: Supabase auth flows, protected dashboard, auth-aware reservation UX.
- ✅ Module 3 completed: smart availability engine with overlap/capacity protections.

## Progress summary after Module 4
- ✅ Dashboard reservation board with date filter.
- ✅ Table-based reservation management view.
- ✅ Reservation status lifecycle controls (`confirmed -> seated -> completed`, plus `cancelled`).
- ✅ Dashboard API for daily reservations and table metadata.

---

## Structure and where each component is used

- `app/api/dashboard/reservations/route.ts`
  - `GET`: returns daily reservations + active tables for dashboard.
  - `PATCH`: updates reservation status.
- `components/dashboard/reservation-board.tsx`
  - Client dashboard board:
    - loads daily data,
    - groups reservations by table,
    - supports status transitions and cancellation.
- `app/dashboard/page.tsx`
  - Protected SSR page that renders operations summary + reservation board.

(Modules 1–3 remain active: auth, availability API, reservation API, and marketing/reservations flows.)

---

## Current module roadmap

1. ✅ Module 1: foundation, marketing pages, reservation CRUD entrypoint.
2. ✅ Module 2: authentication (guest vs logged-in), Supabase auth flows.
3. ✅ Module 3: smart table availability engine and conflict checking.
4. ✅ Module 4: restaurant dashboard reservation calendar/table management.
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
