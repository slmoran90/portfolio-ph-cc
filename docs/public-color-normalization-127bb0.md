# Public Site Color Normalization for Carla Cáceres Photography

Normalize public frontend colors to the new design system tokens while maintaining the warm, feminine, premium aesthetic.

## Current Public Color Debt

### Files with Old Color Usages (13 files)

**app/(site) routes (3 files):**
- `app/(site)/contact/page.tsx` — bg-cream, bg-champagne, text-dusty-rose, text-warm-gray, border-dusty-rose
- `app/(site)/about/page.tsx` — bg-cream, text-dusty-rose, bg-champagne
- `app/(site)/projects/[slug]/project-detail-client.tsx` — text-dusty-rose, text-warm-gray

**components/home (5 files):**
- `components/home/testimonials-section.tsx` — bg-champagne, text-dusty-rose
- `components/home/hero-section.tsx` — text-dusty-rose
- `components/home/featured-gallery.tsx` — bg-cream, text-warm-gray
- `components/home/cta-section.tsx` — bg-cream, bg-champagne, bg-dusty-rose, text-dusty-rose
- `components/home/about-preview.tsx` — bg-champagne, text-dusty-rose

**components/site (2 files):**
- `components/site/project-card.tsx` — text-dusty-rose, text-warm-gray
- `components/site/page-hero.tsx` — bg-cream, text-dusty-rose

**text-muted-foreground usage (14 files):**
- Multiple files use `text-muted-foreground` which should be replaced with `text-foreground-muted` for consistency

## Replacement Map

### Background Colors
- `bg-cream` → `bg-surface-alt` (for section backgrounds, cards)
- `bg-champagne` → `bg-champagne` (keep - brand token for decorative elements)
- `bg-dusty-rose` → `bg-primary-soft` (for decorative backgrounds)
- `bg-champagne/30` → `bg-champagne/30` (keep - decorative)
- `bg-champagne/50` → `bg-champagne/50` (keep - decorative)
- `bg-champagne/20` → `bg-champagne/20` (keep - decorative)
- `bg-dusty-rose/10` → `bg-primary-soft/10` (decorative)

### Text Colors
- `text-dusty-rose` → `text-primary-soft` (for labels, accents, icons)
- `text-warm-gray` → `text-foreground-muted` (for hover states, secondary text)
- `text-muted-foreground` → `text-foreground-muted` (for consistency with new token system)

### Border Colors
- `border-dusty-rose` → `border-primary-soft` (for focus states, hover borders)
- `border-dusty-rose/50` → `border-primary-soft/50` (for hover states)

### Focus Ring Colors
- `focus:border-dusty-rose` → `focus:border-primary-soft`
- `focus:ring-dusty-rose` → `focus:ring-primary-soft`

## File-by-File Implementation Plan

### Phase 1: Core Components (2 files)
**Priority: High — Used across multiple pages**

1. `components/site/page-hero.tsx`
   - Replace `bg-cream` → `bg-surface-alt`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted`

2. `components/site/project-card.tsx`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-warm-gray` → `text-foreground-muted`
   - Replace `text-muted-foreground` → `text-foreground-muted`

### Phase 2: Home Components (5 files)
**Priority: High — Homepage-specific**

3. `components/home/hero-section.tsx`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted`

4. `components/home/featured-gallery.tsx`
   - Replace `bg-cream` → `bg-surface-alt`
   - Replace `text-warm-gray` → `text-foreground-muted`
   - Replace `text-muted-foreground` → `text-foreground-muted`

5. `components/home/cta-section.tsx`
   - Replace `bg-cream` → `bg-surface-alt`
   - Keep `bg-champagne/20` (decorative)
   - Replace `bg-dusty-rose/10` → `bg-primary-soft/10`
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted`

6. `components/home/about-preview.tsx`
   - Keep `bg-champagne/50` (decorative)
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted`

7. `components/home/testimonials-section.tsx`
   - Keep `bg-champagne/30` (decorative)
   - Replace `text-dusty-rose` → `text-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted`

### Phase 3: Page Routes (3 files)
**Priority: Medium — Page-specific**

8. `app/(site)/about/page.tsx`
   - Replace `bg-cream` → `bg-surface-alt`
   - Replace `text-dusty-rose` → `text-primary-soft` (3 instances)
   - Keep `bg-champagne/50` (decorative)
   - Replace `text-muted-foreground` → `text-foreground-muted` (4 instances)

9. `app/(site)/contact/page.tsx`
   - Replace `bg-cream` → `bg-surface-alt` (2 instances)
   - Keep `bg-champagne/30` (decorative)
   - Replace `text-dusty-rose` → `text-primary-soft` (3 instances)
   - Replace `text-warm-gray` → `text-foreground-muted` (2 instances)
   - Replace `border-dusty-rose` → `border-primary-soft`
   - Replace `border-dusty-rose/50` → `border-primary-soft/50`
   - Replace `focus:border-dusty-rose` → `focus:border-primary-soft`
   - Replace `focus:ring-dusty-rose` → `focus:ring-primary-soft`
   - Replace `text-muted-foreground` → `text-foreground-muted` (4 instances)

10. `app/(site)/projects/[slug]/project-detail-client.tsx`
    - Replace `text-dusty-rose` → `text-primary-soft`
    - Replace `text-warm-gray` → `text-foreground-muted`
    - Replace `text-muted-foreground` → `text-foreground-muted` (2 instances)

### Phase 4: Additional Page Routes (2 files)
**Priority: Low — Less critical**

11. `app/(site)/projects/projects-page-client.tsx`
    - Replace `text-muted-foreground` → `text-foreground-muted`

12. `app/(site)/gallery/gallery-client.tsx`
    - Replace `text-muted-foreground` → `text-foreground-muted`

13. `components/site/category-filter.tsx`
    - Replace `text-muted-foreground` → `text-foreground-muted`

## Files to NOT Touch

**Admin pages and components:**
- All files in `app/(dashboard)/`
- All files in `components/admin/`

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

1. **Phase 1** (Core Components) — Foundation, affects multiple pages
2. **Phase 2** (Home Components) — Homepage-specific, high visibility
3. **Phase 3** (Page Routes) — Page-specific, medium visibility
4. **Phase 4** (Additional Routes) — Low priority, minimal impact

## Risks

1. **Visual shift**: Colors may shift slightly due to token refinements — mitigated by subtle refinements only
2. **Scope**: 13 files — medium risk of missing instances — mitigated by systematic grep search
3. **Focus states**: Contact form focus colors may shift — mitigated by using semantic tokens
4. **Hover states**: Hover colors may shift — mitigated by using semantic tokens

## Expected Visual Impact

**Subtle refinement:**
- Backgrounds slightly warmer (cream → surface-alt)
- Accent colors more harmonious (dusty-rose → primary-soft)
- Text colors more consistent (warm-gray → foreground-muted)
- Overall more cohesive but not dramatically different

**No breaking changes:**
- No layout changes
- No typography changes
- No animation changes
- No route behavior changes

## Verification Checklist

**Phase 1:**
- [ ] page-hero.tsx uses new tokens
- [ ] project-card.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: hero section looks correct
- [ ] Visual check: project cards look correct

**Phase 2:**
- [ ] hero-section.tsx uses new tokens
- [ ] featured-gallery.tsx uses new tokens
- [ ] cta-section.tsx uses new tokens
- [ ] about-preview.tsx uses new tokens
- [ ] testimonials-section.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: homepage looks correct

**Phase 3:**
- [ ] about/page.tsx uses new tokens
- [ ] contact/page.tsx uses new tokens
- [ ] project-detail-client.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: about page looks correct
- [ ] Visual check: contact page looks correct
- [ ] Visual check: project detail page looks correct

**Phase 4:**
- [ ] projects-page-client.tsx uses new tokens
- [ ] gallery-client.tsx uses new tokens
- [ ] category-filter.tsx uses new tokens
- [ ] Build passes
- [ ] Visual check: projects page looks correct
- [ ] Visual check: gallery page looks correct

**Overall:**
- [ ] No hardcoded bg-cream in public
- [ ] No hardcoded bg-dusty-rose in public
- [ ] No hardcoded text-dusty-rose in public
- [ ] No hardcoded text-warm-gray in public
- [ ] No hardcoded border-dusty-rose in public
- [ ] All text-muted-foreground replaced with text-foreground-muted
- [ ] Build passes
- [ ] Public site visually harmonious
- [ ] No layout breakage
- [ ] No typography breakage
- [ ] Responsive behavior preserved
