# Latest API references used for Modules 1 + 2

Checked against official docs for the APIs used in the current implementation:

- Next.js App Router
  - Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  - Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  - Proxy file convention: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Supabase (Next.js SSR + Auth)
  - Creating a client (Next.js): https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - Next.js SSR auth guide: https://supabase.com/docs/guides/auth/server-side/nextjs
  - JavaScript auth sign-in: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
  - JavaScript auth sign-up: https://supabase.com/docs/reference/javascript/auth-signup
  - JavaScript auth sign-out: https://supabase.com/docs/reference/javascript/auth-signout
- Prisma ORM 7
  - Upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  - Prisma schema overview: https://www.prisma.io/docs/orm/prisma-schema/overview
  - CRUD with Prisma Client: https://www.prisma.io/docs/orm/prisma-client/queries/crud

## Module 2-specific updates
- Added server-action based auth flows (`signIn`, `signUp`, `signOut`).
- Added protected SSR dashboard route.
- Added client-safe session endpoint (`/api/auth/user`) for booking UX personalization.
