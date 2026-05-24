# Project Overview

Photography portfolio + admin dashboard.

## Stack
- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- Framer Motion
- Supabase SSR
- App Router only

## Current Goals
- Remove legacy imports and architecture
- Complete Supabase integration
- Stabilize auth
- Separate client/server responsibilities
- Replace mock data with database layer
- Make admin panel production-ready

## Important Constraints
- DO NOT rewrite UI unnecessarily
- DO NOT change design system
- DO NOT create duplicated abstractions
- DO NOT mix client/server code
- DO NOT use Pages Router patterns
- DO NOT introduce unnecessary providers

## Current Problems
- Legacy imports from old mock data structure
- Mixed client/server Supabase usage
- Some components still depend on old interfaces
- Type mismatches between mock and db models
- Admin dashboard still partially mocked
- Possible server imports leaking into client components

## Desired Architecture

lib/
  data/
  supabase/
    browser.ts
    server.ts
    proxy.ts
  mappers/
  types/

app/
  (site)/
  (auth)/
  (dashboard)/

## Important Notes
- Server Components fetch data
- Client Components receive serializable props only
- No server imports inside client components
- Mapping layer required between DB model and UI model