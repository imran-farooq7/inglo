# Inglo Smart Reservations (Module-Based Build)

This repository now contains **Module 1: Foundation + Marketing + Reservation API V1**.

## Progress summary (before Module 1)
- Completed so far: _none_ (fresh start).

## Progress summary (after Module 1)
- ✅ Next.js App Router project scaffolded with TypeScript and linting.
- ✅ Functional UI landing page based on your exact marketing copy.
- ✅ Reservation form page (`/reservations`) connected to a backend API route.
- ✅ Prisma schema (Restaurant, Table, Reservation) with seed data.
- ✅ Supabase SSR server client helper for upcoming auth modules.
- ✅ Module plan documented for iterative delivery.

---

## Stack and why it is used
- **Next.js (App Router)**: frontend + backend route handlers in one codebase.
- **Supabase**: Postgres hosting, auth, and policy-ready platform.
- **Prisma**: type-safe database model and query layer.

---

## Project structure and component usage

- `app/layout.tsx`
  - Global shell (root layout) for all pages.
- `app/page.tsx`
  - Home route (`/`) that renders `MarketingContent`.
- `components/marketing-content.tsx`
  - Landing page sections:
    - Hero
    - Product fit badges
    - Reservation management highlights
    - 3-step workflow cards
- `app/reservations/page.tsx`
  - Reservation page wrapper that renders `ReservationForm`.
- `components/reservation-form.tsx`
  - Client component that submits booking payload to `POST /api/reservations`.
- `app/api/reservations/route.ts`
  - Backend route handlers:
    - `POST`: validate + create reservation
    - `GET`: list reservations
- `lib/reservation-schema.ts`
  - Shared Zod validation schema and booking types.
- `lib/prisma.ts`
  - Prisma client singleton (safe for dev hot reload).
- `lib/supabase-server.ts`
  - Supabase SSR server client based on cookies.
- `prisma/schema.prisma`
  - Database models and enums.
- `prisma/seed.ts`
  - Demo seed for one restaurant, tables, and one reservation.

---

## Module roadmap

1. **Module 1 (done)**: foundation, marketing pages, reservation CRUD entrypoint.
2. **Module 2**: authentication (guest vs logged-in), Supabase auth flows.
3. **Module 3**: smart table availability engine and conflict checking.
4. **Module 4**: restaurant dashboard (calendar/slots/table view).
5. **Module 5**: role-based staff tools and premium booking rules.
6. **Module 6**: analytics and optimization suggestions.

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
3. Run Prisma migration + generate + seed (after DB is available):
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

