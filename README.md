# Inglo Smart Reservations (Module-Based Build)

## Progress summary before Module 2
- ✅ Module 1 completed:
  - Next.js App Router + TypeScript foundation
  - Marketing homepage (`/`)
  - Reservation page (`/reservations`)
  - Reservation API (`GET` + `POST`)
  - Prisma schema + seed data
  - Prisma 7 + Supabase SSR baseline setup

## Progress summary after Module 2
- ✅ Supabase auth flows (sign up, sign in, sign out) via Server Actions.
- ✅ Protected dashboard route (`/dashboard`) with SSR user guard.
- ✅ App-level auth-aware navigation (`AuthStatus`) in layout.
- ✅ Session-aware reservation form (auto-upgrades booking type to logged-in when authenticated).
- ✅ Auth session endpoint (`/api/auth/user`) for client-safe session context.

---

## Structure and where each component is used

- `app/layout.tsx`
  - Global app shell + top navigation.
  - Renders `AuthStatus` in every page.
- `components/auth/auth-status.tsx`
  - Server component that shows auth links for guests and dashboard/sign-out for signed-in users.
- `app/auth/actions.ts`
  - Server Actions for `signInAction`, `signUpAction`, `signOutAction`.
- `app/auth/sign-in/page.tsx`
  - Sign-in page route using reusable `AuthForm`.
- `app/auth/sign-up/page.tsx`
  - Sign-up page route using reusable `AuthForm`.
- `components/auth/auth-form.tsx`
  - Shared auth UI component for both sign-in and sign-up pages.
- `app/dashboard/page.tsx`
  - Protected SSR page; redirects unauthenticated users to sign-in.
- `app/api/auth/user/route.ts`
  - Returns lightweight authenticated user payload for client components.
- `components/reservation-form.tsx`
  - Uses `/api/auth/user` to detect user session and adapt booking defaults.

---

## Current module roadmap

1. ✅ Module 1: foundation, marketing pages, reservation CRUD entrypoint.
2. ✅ Module 2: authentication (guest vs logged-in), Supabase auth flows.
3. ⏳ Module 3: smart table availability engine and conflict checking.
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
3. Add this optional redirect URL setting for auth emails:
   ```bash
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
4. Run Prisma generate + migration + seed:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

Open:
- `http://localhost:3000/`
- `http://localhost:3000/auth/sign-in`
- `http://localhost:3000/auth/sign-up`
- `http://localhost:3000/dashboard`
