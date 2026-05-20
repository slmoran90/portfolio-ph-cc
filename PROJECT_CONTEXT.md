# Stack

- Next.js 16 App Router
- TypeScript strict
- Tailwind v4
- shadcn/ui
- Framer Motion
- Supabase (planned)

# Arquitectura

- Route groups:
  - (site)
  - (auth)
  - (dashboard)

# Convenciones

- Commits atómicos
- Una fase por branch
- PR pequeñas hacia dev

# Fases completadas

- 0.1 build validation
- 0.3 css cleanup
- 1.x route groups/layouts

# Decisiones importantes

- app/globals.css = única fuente global
- ignoreBuildErrors eliminado
- login separado del dashboard layout

# Próximos pasos

- middleware placeholder
- auth foundation
- supabase clients

# No hacer todavía

- multi-tenant
- i18n
- blog
- ecommerce
