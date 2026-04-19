# Latest API references used for Modules 1 + 2 + 3 + 4

Checked against official docs for APIs used in the implementation:

- Next.js App Router
  - Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  - Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  - Client Components and hooks: https://nextjs.org/docs/app/building-your-application/rendering/client-components
- Supabase (Next.js SSR + Auth)
  - Creating a client (Next.js): https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - Next.js SSR auth guide: https://supabase.com/docs/guides/auth/server-side/nextjs
- Prisma ORM 7
  - Upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - Filtering and sorting queries: https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
  - CRUD with Prisma Client: https://www.prisma.io/docs/orm/prisma-client/queries/crud

## Module 4-specific updates
- Added dashboard reservations API (`GET` + `PATCH`) for daily operations.
- Added date-scoped table board UI for managing live reservation status.
