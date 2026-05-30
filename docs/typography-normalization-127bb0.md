# Phase 13 — Typography Normalization Plan (Reduced Scope)

This plan normalizes public site typography only, focusing on editorial elegance for Carla Cáceres Photography while deferring admin typography to a separate branch.

## Scope Reduction

**This branch implements ONLY Phase 1: Public typography hierarchy**
- Admin typography deferred to separate branch
- Shared UI changes deferred unless required for public typography
- Focus on visual hierarchy consistency across public site

## Current Public Typography Debt

### Font Configuration
- **Sans-serif:** Inter (body/UI) — configured and working
- **Serif:** Cormorant Garamond (headings) — configured and working

### Identified Issues (Public Site Only)
1. Inconsistent heading scale: hero uses 7xl, sections use 5xl, pages use 6xl
2. Overline tracking varies: 0.2em vs 0.3em
3. Button tracking inconsistent: some use tracking-wider, some don't
4. Card titles vary: text-xl vs text-lg
5. Body text sizes inconsistent: text-lg vs text-sm

## Public Typography Rules (Implementation Target)

### Hierarchy
1. **Hero/Display:** font-serif, 4xl→5xl→7xl, leading-[1.1], text-balance
2. **Page H1:** font-serif, 4xl→5xl→6xl, leading-tight, text-balance
3. **Section H2:** font-serif, 3xl→4xl→5xl, leading-tight, text-balance
4. **Card H3:** font-serif, 2xl, leading-tight (standardize from xl/lg)
5. **Overline:** font-sans, xs, tracking-[0.3em], uppercase, font-medium, text-primary-soft

### Body Text
1. **Hero/Section description:** font-sans, lg, leading-relaxed, text-foreground-muted
2. **Card description:** font-sans, sm, leading-relaxed, text-foreground-muted
3. **Metadata/captions:** font-sans, xs, text-foreground-muted

### Buttons
1. **Primary/Secondary:** font-sans, sm, tracking-wider, uppercase

### Navigation
1. **Header links:** font-sans, sm, tracking-widest, uppercase
2. **Footer links:** font-sans, sm, tracking-widest, uppercase

## Affected Files (Public Site Only - 10 files)

**Layout Components (3):**
- `components/layout/header.tsx` — logo, nav links (tracking-widest)
- `components/layout/footer.tsx` — headings, links (tracking-widest)
- `components/layout/section.tsx` — section headings (3xl→4xl→5xl)

**Home Components (4):**
- `components/home/hero-section.tsx` — hero heading (4xl→5xl→7xl), description (lg), buttons (tracking-wider)
- `components/home/featured-gallery.tsx` — card titles (2xl)
- `components/home/cta-section.tsx` — heading (3xl→4xl→5xl), description (lg), button (tracking-wider)
- `components/home/about-preview.tsx` — heading (3xl→4xl→5xl), button (tracking-wider)

**Site Components (3):**
- `components/site/page-hero.tsx` — page heading (4xl→5xl→6xl), description (lg)
- `components/site/project-card.tsx` — card titles (2xl), metadata (xs, tracking-[0.3em])
- `components/site/category-filter.tsx` — filter buttons (tracking-wider)

**Public Pages (0 - deferred):**
- Page files deferred to avoid scope creep
- Components handle typography, pages consume components

## Implementation Order

### Step 1: Standardize Heading Sizes
1. Hero: 4xl→5xl→7xl with leading-[1.1]
2. Page H1: 4xl→5xl→6xl with leading-tight
3. Section H2: 3xl→4xl→5xl with leading-tight
4. Card H3: 2xl with leading-tight

### Step 2: Standardize Overlines & Labels
1. Overline: xs, tracking-[0.3em], uppercase, font-medium
2. Metadata: xs, tracking-[0.3em], uppercase

### Step 3: Standardize Buttons
1. Button text: sm, tracking-wider, uppercase

### Step 4: Standardize Body Text
1. Descriptions: lg, leading-relaxed
2. Card descriptions: sm, leading-relaxed

### Step 5: Standardize Navigation
1. Nav links: sm, tracking-widest, uppercase

## Specific Changes by File

**components/layout/section.tsx:**
- Section heading: font-serif, 3xl→4xl→5xl, leading-tight, text-balance
- Description: lg, leading-relaxed

**components/home/hero-section.tsx:**
- Overline: xs, tracking-[0.3em], uppercase, font-medium
- Hero heading: font-serif, 4xl→5xl→7xl, leading-[1.1], text-balance
- Description: lg, leading-relaxed
- Buttons: sm, tracking-wider, uppercase

**components/home/featured-gallery.tsx:**
- Card title: font-serif, 2xl, leading-tight

**components/home/cta-section.tsx:**
- Overline: xs, tracking-[0.3em], uppercase, font-medium
- Heading: font-serif, 3xl→4xl→5xl, leading-tight, text-balance
- Description: lg, leading-relaxed
- Button: sm, tracking-wider, uppercase

**components/home/about-preview.tsx:**
- Overline: xs, tracking-[0.3em], uppercase, font-medium
- Heading: font-serif, 3xl→4xl→5xl, leading-tight, text-balance
- Button: sm, tracking-wider, uppercase

**components/site/page-hero.tsx:**
- Overline: xs, tracking-[0.3em], uppercase, font-medium
- Page heading: font-serif, 4xl→5xl→6xl, leading-tight, text-balance
- Description: lg, leading-relaxed

**components/site/project-card.tsx:**
- Category label: xs, tracking-[0.3em], uppercase
- Card title: font-serif, 2xl, leading-tight
- Card description: sm, leading-relaxed

**components/site/category-filter.tsx:**
- Filter buttons: sm, tracking-wider, uppercase

**components/layout/header.tsx:**
- Nav links: sm, tracking-widest, uppercase

**components/layout/footer.tsx:**
- Footer links: sm, tracking-widest, uppercase

## Risks

1. **Layout shifts:** Increasing description text from sm to lg may cause overflow in tight spaces
2. **Line-height changes:** leading-relaxed on descriptions may increase vertical spacing
3. **Card title size:** Increasing to 2xl may cause wrapping in narrow cards
4. **Button tracking:** tracking-wider may cause button text to overflow in narrow containers

## Verification Checklist

### Public Site
- [ ] Hero headings use 4xl→5xl→7xl with leading-[1.1]
- [ ] Page headings use 4xl→5xl→6xl with leading-tight
- [ ] Section headings use 3xl→4xl→5xl with leading-tight
- [ ] Card titles use 2xl consistently
- [ ] Overlines use xs with tracking-[0.3em] uppercase
- [ ] Buttons use sm with tracking-wider uppercase
- [ ] Body descriptions use lg with leading-relaxed
- [ ] Card descriptions use sm with leading-relaxed
- [ ] Nav links use sm with tracking-widest uppercase

### Build & Cross-Check
- [ ] `pnpm build` passes
- [ ] No admin files modified
- [ ] No logic/data files modified
- [ ] No spacing/layout structure changes (unintentional)
- [ ] No content/copy changes
- [ ] No color changes
- [ ] Visual check: public site feels editorial and premium

## Files Not to Touch

- All admin files (`app/(dashboard)/*`, `components/admin/*`)
- Public page files (`app/(site)/*`) — components handle typography
- Shared UI (`components/ui/*`)
- `app/layout.tsx` — font configuration is correct
- `app/globals.css` — CSS variables are correct
- CMS logic files
- Supabase/data/actions/storage files
- Auth/demo mode files
- Routing files
- Contact/WhatsApp behavior files

## Post-Implementation Steps

1. Run `pnpm build`
2. Summarize changed files
3. List any layout shift risks found
4. Stop (admin typography deferred to separate branch)
