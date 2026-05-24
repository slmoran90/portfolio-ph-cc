# Audit Rules

## NEVER
- rewrite entire files unnecessarily
- create fake abstractions
- duplicate components
- mix database models with UI models
- import server utilities inside client components
- break existing UI

## ALWAYS
- prefer minimal fixes
- explain WHY before changing architecture
- preserve existing component APIs if possible
- keep App Router compatible
- use async server functions correctly
- separate concerns clearly

## Required Output Style
For every task:
1. Explain root cause
2. Explain safest fix
3. Show exact files affected
4. Show migration path
5. Avoid speculative refactors