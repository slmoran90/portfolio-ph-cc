# Admin Color Normalization for Carla Cáceres Photography

Normalize admin dashboard colors to the new design system tokens while maintaining a clean, utilitarian, and readable interface.

## Current Admin Color Debt

**Files with Old Color Usages (11 files)**

**app/(dashboard) routes (8 files):**
- `app/(dashboard)/layout.tsx` — bg-cream (1 instance)
- `app/(dashboard)/admin/settings/settings-client.tsx` — bg-champagne, text-dusty-rose, text-muted-foreground
- `app/(dashboard)/admin/testimonials/testimonials-client.tsx` — text-dusty-rose, bg-champagne, border-champagne, text-muted-foreground
- `app/(dashboard)/admin/services/services-client.tsx` — text-dusty-rose, text-muted-foreground
- `app/(dashboard)/admin/projects/new/page.tsx` — border-dusty-rose, bg-cream, text-dusty-rose, bg-champagne, text-muted-foreground
- `app/(dashboard)/admin/projects/projects-list-client.tsx` — border-dusty-rose, bg-champagne
- `app/(dashboard)/admin/projects/[id]/edit-project-client.tsx` — border-dusty-rose, bg-cream, text-dusty-rose, bg-champagne, text-muted-foreground
- `app/(dashboard)/admin/gallery/gallery-client.tsx` — border-dusty-rose, bg-cream, text-dusty-rose

**components/admin (3 files):**
- `components/admin/sidebar.tsx` — bg-champagne, text-muted-foreground
- `components/admin/cards.tsx` — bg-cream, text-muted-foreground
- `components/admin/header.tsx` — text-muted-foreground

**text-muted-foreground usage (11 files):** Should be replaced with `text-foreground-muted` for consistency

## Replacement Map

### Background Colors
- `bg-cream` → `bg-surface-alt` (for admin layout background, cards, upload areas)
- `bg-champagne` → `bg-champagne` (keep - brand token for decorative elements)
- `bg-champagne/30` → `bg-champagne/30` (keep - decorative)
- `bg-champagne/40` → `bg-champagne/40` (keep - decorative)
- `bg-champagne/50` → `bg-champagne/50` (keep - decorative)
- `bg-dusty-rose` → `bg-primary-soft` (for badges, indicators, active states)
- `bg-dusty-rose/10` → `bg-primary-soft/10` (for decorative backgrounds)

### Text Colors
- `text-dusty-rose` → `text-primary-soft` (for icons, accents, loaders)
- `text-muted-foreground` → `text-foreground-muted` (for consistency with new token system)

### Border Colors
- `border-dusty-rose` → `border-primary-soft` (for focus states, active borders)
- `border-champagne` → `border-champagne` (keep - brand token for decorative borders)
- `border-champagne/50` → `border-champagne/50` (keep - decorative)

### Focus Ring Colors
- `focus:border-dusty-rose` → `focus:border-primary-soft`
- `focus:ring-dusty-rose` → `focus:ring-primary-soft`
- `fill-dusty-rose` → `fill-primary-soft`

## File-by-File Implementation Plan

### Phase 1: Core Admin Components (3 files)
**Priority: High — Used across all admin pages**

1. `components/admin/sidebar.tsx`
   - Keep `bg-champagne` (decorative)
   - Replace `text-muted-foreground` → `text-foreground-muted`

2. `components/admin/cards.tsx`
   - Replace `bg-cream` → `bg-surface-alt` (2 instances)
   - Replace `text-muted-foreground` → `text-foreground-muted` (3 instances)

3. `components/admin/header.tsx`
   - Replace `text-muted-foreground` → `text-foreground-muted` (3 instances)

### Phase 2: Admin Layout (1 file)
**Priority: High — Foundation for all admin pages**

4. `app/(dashboard)/layout.tsx`
   - Replace `bg-cream` → `bg-surface-alt`

### Phase 3: Admin Page Routes (5 files)
**Priority: Medium — Page-specific**

5. `app/(dashboard)/admin/settings/settings-client.tsx`
   - Keep `bg-champagne/30` (decorative)
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted` (4 instances)
   - Replace `focus:border-dusty-rose` → `focus:border-primary-soft`
   - Replace `focus:ring-dusty-rose` → `focus:ring-primary-soft`

6. `app/(dashboard)/admin/testimonials/testimonials-client.tsx`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Keep `bg-champagne/30` and `border-champagne/50` (decorative)
   - Replace `text-muted-foreground` → `text-foreground-muted` (8 instances)

7. `app/(dashboard)/admin/services/services-client.tsx`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted` (6 instances)

8. `app/(dashboard)/admin/projects/projects-list-client.tsx`
   - Replace `border-dusty-rose` → `border-primary-soft`
   - Replace `focus:border-dusty-rose` → `focus:border-primary-soft`
   - Replace `focus:ring-dusty-rose` → `focus:ring-primary-soft`
   - Keep `bg-champagne/30` (decorative)

9. `app/(dashboard)/admin/gallery/gallery-client.tsx`
   - Replace `border-dusty-rose` → `border-primary-soft`
   - Replace `bg-cream` → `bg-surface-alt`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Keep `bg-champagne/10` (decorative)

### Phase 4: Project Forms (2 files)
**Priority: Medium — Form-specific**

10. `app/(dashboard)/admin/projects/new/page.tsx`
    - Replace `border-dusty-rose` → `border-primary-soft`
    - Replace `bg-cream` → `bg-surface-alt`
    - Replace `text-dusty-rose` → `text-primary-soft` (5 instances)
    - Replace `fill-dusty-rose` → `fill-primary-soft`
    - Keep `bg-champagne/10` (decorative)
    - Replace `text-muted-foreground` → `text-foreground-muted` (3 instances)
    - Replace `focus:border-dusty-rose` → `focus:border-primary-soft` (3 instances)
    - Replace `focus:ring-dusty-rose` → `focus:ring-primary-soft` (3 instances)

11. `app/(dashboard)/admin/projects/[id]/edit-project-client.tsx`
    - Replace `border-dusty-rose` → `border-primary-soft`
    - Replace `bg-cream` → `bg-surface-alt`
    - Replace `text-dusty-rose` → `text-primary-soft` (5 instances)
    - Replace `fill-dusty-rose` → `fill-primary-soft`
    - Keep `bg-champagne/10` (decorative)
    - Replace `text-muted-foreground` → `text-foreground-muted` (3 instances)
    - Replace `focus:border-dusty-rose` → `focus:border-primary-soft` (3 instances)
    - Replace `focus:ring-dusty-rose` → `focus:ring-primary-soft` (3 instances)

## Files to NOT Touch

**Public frontend:**
- All files in `app/(site)/`
- All files in `components/home/`
- All files in `components/site/`
- All files in `components/layout/` (except admin-specific)

**Logic and data files:**
- All files in `lib/actions/`
- All files in `lib/data/`
- All files in `lib/supabase/`

**Auth and demo mode:**
- `middleware.ts`
- `lib/supabase/proxy.ts`

**Configuration:**
- `app/globals.css` (already updated in Phase 1-3)
- `next.config.mjs`
- `tsconfig.json`

**Copy/content:**
- No changes to actual text content, only CSS classes

## Implementation Order

1. **Phase 1** (Core Admin Components) — Foundation, affects all admin pages
2. **Phase 2** (Admin Layout) — Layout foundation
3. **Phase 3** (Admin Page Routes) — Page-specific, medium visibility
4. **Phase 4** (Project Forms) — Form-specific, complex components

## Risks

1. **Visual shift**: Admin colors may shift slightly due to token refinements — mitigated by subtle refinements only
2. **Scope**: 11 files — medium risk of missing instances — mitigated by systematic grep search
3. **Focus states**: Form focus colors may shift — mitigated by using semantic tokens
4. **Upload areas**: Upload UI may shift — mitigated by using semantic tokens
5. **Badges/indicators**: Status badges may shift — mitigated by using semantic tokens

## Expected Visual Impact

**Subtle refinement:**
- Admin layout background slightly warmer (cream → surface-alt)
- Accent colors more harmonious (dusty-rose → primary-soft)
- Text colors more consistent (muted-foreground → foreground-muted)
- Overall more cohesive but not dramatically different
- Admin remains clean, utilitarian, and readable

**No breaking changes:**
- No layout changes
- No typography changes
- No animation changes
- No route behavior changes
- No form logic changes

## Verification Checklist

**Phase 1:**
- [ ] sidebar.tsx uses new tokens
- [ ] cards.tsx uses new tokens
- [ ] header.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: sidebar looks correct
- [ ] Visual check: admin cards look correct
- [ ] Visual check: admin header looks correct

**Phase 2:**
- [ ] layout.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: admin layout background looks correct

**Phase 3:**
- [ ] settings-client.tsx uses new tokens
- [ ] testimonials-client.tsx uses new tokens
- [ ] services-client.tsx uses new tokens
- [ ] projects-list-client.tsx uses new tokens
- [ ] gallery-client.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: settings page looks correct
- [ ] Visual check: testimonials page looks correct
- [ ] Visual check: services page looks correct
- [ ] Visual check: projects list looks correct
- [ ] Visual check: gallery page looks correct

**Phase 4:**
- [ ] new/page.tsx uses new tokens
- [ ] edit-project-client.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: new project form looks correct
- [ ] Visual check: edit project form looks correct
- [ ] Visual check: upload areas look correct
- [ ] Visual check: focus states look correct

**Overall:**
- [ ] No hardcoded bg-cream in admin
- [ ] No hardcoded bg-dusty-rose in admin
- [ ] No hardcoded text-dusty-rose in admin
- [ ] No hardcoded border-dusty-rose in admin
- [ ] All text-muted-foreground replaced with text-foreground-muted
- [ ] Build passes
- [ ] Admin dashboard visually harmonious
- [ ] No layout breakage
- [ ] No typography breakage
- [ ] Form focus states preserved
- [ ] Upload areas functional
- [ ] Badges/indicators readable
