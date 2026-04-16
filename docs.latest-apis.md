# Latest API references used for this update

Checked against official documentation pages for APIs used in the current implementation:

- Next.js App Router
  - Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  - Proxy file convention: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Supabase (Next.js SSR)
  - Creating a client (Next.js): https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - JavaScript client initialization: https://supabase.com/docs/reference/javascript/initializing
- Prisma ORM 7
  - Upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - Prisma schema overview: https://www.prisma.io/docs/orm/prisma-schema/overview
  - CRUD with Prisma Client: https://www.prisma.io/docs/orm/prisma-client/queries/crud

### What changed from previous module baseline
- Prisma moved to v7 dependencies and Prisma 7-style config (`prisma.config.ts`).
- Schema generator switched to `provider = "prisma-client"` with explicit output.
- Supabase setup now follows latest App Router SSR pattern:
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/proxy.ts`
  - root `proxy.ts`
- Env key updated to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
