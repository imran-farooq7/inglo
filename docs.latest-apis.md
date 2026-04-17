# Latest API references used for Modules 1 + 2 + 3

Checked against official docs for APIs used in the current implementation:

- Next.js App Router
  - Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  - Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  - Proxy file convention: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Supabase (Next.js SSR + Auth)
  - Creating a client (Next.js): https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - Next.js SSR auth guide: https://supabase.com/docs/guides/auth/server-side/nextjs
- Prisma ORM 7
  - Upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - Prisma schema overview: https://www.prisma.io/docs/orm/prisma-schema/overview
  - Filtering and sorting queries: https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting

## Module 3-specific updates
- Added a dedicated availability engine in `lib/availability.ts`.
- Added `/api/availability` for live table lookup.
- Added overlap protection + capacity guard on reservation creation.
