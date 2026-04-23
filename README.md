# Inglo Smart Reservations (Module-Based Build)

## Progress summary before Module 5
- ✅ Module 1 completed: foundation, marketing, reservations API, Prisma and Supabase baseline.
- ✅ Module 2 completed: Supabase auth flows and protected account-aware UX.
- ✅ Module 3 completed: smart availability engine with overlap/capacity protections.
- ✅ Module 4 completed: dashboard reservation board + status lifecycle actions.

## Progress summary after Module 5
- ✅ Role-based access checks for staff tools.
- ✅ Dashboard APIs are now staff-only.
- ✅ Dashboard page now redirects non-staff users away from staff operations.
- ✅ Reservation API enforces booking-type rules:
  - `staff` booking type requires staff role,
  - `premium` booking type requires premium membership + lead-time rule.
- ✅ Session API now returns role + premium flags for client feature gating.

---

## Structure and where each component is used

- `lib/roles.ts`
  - Role and membership policy module:
    - resolves role from email,
    - checks premium membership,
    - validates premium lead-time policy.
- `app/api/auth/user/route.ts`
  - Returns `{ user, role, premium }` for client components.
- `app/api/dashboard/reservations/route.ts`
  - Staff-only dashboard data and reservation status update endpoints.
- `app/api/reservations/route.ts`
  - Reservation creation now enforces staff/premium booking-type rules.
- `app/dashboard/page.tsx`
  - Staff-only page guard.
- `components/reservation-form.tsx`
  - Booking type options are role-aware (staff/premium gating in UI).

---

## Current module roadmap

1. ✅ Module 1: foundation, marketing pages, reservation CRUD entrypoint.
2. ✅ Module 2: authentication (guest vs logged-in), Supabase auth flows.
3. ✅ Module 3: smart table availability engine and conflict checking.
4. ✅ Module 4: restaurant dashboard reservation calendar/table management.
5. ✅ Module 5: role-based staff tools and premium booking rules.
6. ⏳ Module 6: analytics and optimization suggestions.

---

## Environment configuration

Add these optional role/premium policy variables to `.env`:

```bash
STAFF_EMAILS="manager@inglo.app,ops@inglo.app"
STAFF_EMAIL_DOMAIN="inglo.app"
PREMIUM_MEMBER_EMAILS="vip1@example.com,vip2@example.com"
PREMIUM_MIN_LEAD_HOURS="4"
```

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
