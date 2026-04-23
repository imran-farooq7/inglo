# Latest API references used for Modules 1 + 2 + 3 + 4 + 5

Checked against official docs for APIs used in implementation:

- Next.js App Router
  - Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  - Redirects in App Router: https://nextjs.org/docs/app/api-reference/functions/redirect
- Supabase (Next.js SSR + Auth)
  - Creating a client (Next.js): https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - Get authenticated user: https://supabase.com/docs/reference/javascript/auth-getuser
- Prisma ORM 7
  - CRUD with Prisma Client: https://www.prisma.io/docs/orm/prisma-client/queries/crud
  - Filtering and sorting queries: https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting

## Module 5-specific updates
- Added role-policy module (`lib/roles.ts`) for staff and premium checks.
- Made dashboard APIs and page staff-only.
- Added premium booking eligibility and lead-time validation.
