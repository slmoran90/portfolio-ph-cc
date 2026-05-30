# Design System Refinement - Phases 1-3 Only

Implement design token foundation, core UI components, and layout components for controlled rollout with visual verification before full color normalization.

## Scope Adjustment

**This branch (feat/demo-portfolio):**
- Phase 1: Design Token Foundation
- Phase 2: Core UI Components
- Phase 3: Layout Components

**Defer to later branches:**
- Phase 4: Public Site Color Normalization
- Phase 5: Admin Color Normalization
- Phase 6: Typography Normalization
- Phase 7: Spacing Normalization
- Phase 8: Admin/Public Visual Polish

**Rationale:** Controlled rollout with visual verification before applying color normalization across the entire public site and admin.

## Implementation Phases (1-3 Only)

### Phase 1: Design Token Foundation
**Files: 1**
- `app/globals.css` — Refine color tokens, add typography/radius/shadow/spacing scales, update @theme

**Changes:**
- Refine existing OKLCH color tokens (subtle adjustments only)
- Add typography scale variables
- Add radius scale variables
- Add shadow scale variables
- Add spacing scale variables
- Update @theme inline configuration

**Expected visual impact:** Minimal. Colors may shift slightly due to refinements, but overall harmony preserved. No component changes yet.

**Rollback risk:** Very low. Single file, easy to revert.

### Phase 2: Core UI Components
**Files: 6**
- `components/ui/button.tsx` — Token-based colors, normalized variants
- `components/ui/card.tsx` — Token-based borders/shadows/radius
- `components/ui/input.tsx` — Token-based borders/shadows/radius
- `components/ui/badge.tsx` — Token-based colors
- `components/ui/textarea.tsx` — Match input styling
- `components/ui/textarea.tsx` — Match input styling
- `components/ui/select.tsx` — Match input styling

**Changes:**
- Replace hardcoded colors with CSS custom properties
- Normalize radius to scale values
- Normalize shadow to scale values
- Ensure consistent styling across form elements

**Expected visual impact:** Moderate. All forms and interactive elements will use refined tokens. Buttons, cards, inputs, badges may shift slightly in color/size.

**Rollback risk:** Low. Changes are isolated to UI components, easy to revert.

### Phase 3: Layout Components
**Files: 6**
- `components/layout/header.tsx` — Token-based colors
- `components/layout/footer.tsx` — Token-based colors
- `components/layout/section.tsx` — Spacing scale for section padding
- `components/admin/header.tsx` — Token-based colors
- `components/admin/cards.tsx` — Token-based colors/radius
- `components/admin/sidebar.tsx` — Token-based colors

**Changes:**
- Replace hardcoded colors with CSS custom properties
- Apply spacing scale to section padding
- Normalize radius in admin cards

**Expected visual impact:** Moderate. Header, footer, section spacing, and admin components will use refined tokens. Spacing may shift slightly.

**Rollback risk:** Low. Changes are isolated to layout components, easy to revert.

## Implementation Order

1. **Phase 1** (Foundation) — Must be first, no dependencies
2. **Phase 2** (UI Components) — Builds on Phase 1, affects forms
3. **Phase 3** (Layout Components) — Builds on Phase 1-2, affects all pages

## Estimated Modified Files

**Total: 13 files**

Phase 1: 1 file
- `app/globals.css`

Phase 2: 6 files
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
- `components/ui/textarea.tsx`
- `components/ui/select.tsx`

Phase 3: 6 files
- `components/layout/header.tsx`
- `components/layout/footer.tsx`
- `components/layout/section.tsx`
- `components/admin/header.tsx`
- `components/admin/cards.tsx`
- `components/admin/sidebar.tsx`

## Expected Visual Impact Summary

**Phase 1:** Minimal color shifts due to token refinements. No component changes.

**Phase 2:** Forms and interactive elements (buttons, cards, inputs, badges) will use refined tokens. Slight color/size shifts possible.

**Phase 3:** Header, footer, section spacing, and admin components will use refined tokens. Slight spacing shifts possible.

**Overall:** Subtle refinement across the app. No major visual disruption. The app will feel more cohesive but not dramatically different.

## Rollback Risk Summary

**Phase 1:** Very low. Single file change.

**Phase 2:** Low. Isolated to UI components, easy to revert.

**Phase 3:** Low. Isolated to layout components, easy to revert.

**Overall:** Low risk. All changes are additive (adding tokens) and replacements (hardcoded → tokens). No logic changes, no feature changes. Easy to revert by reverting the 13 files.

## Verification Checklist

**Phase 1:**
- [ ] Color tokens refined in globals.css
- [ ] Typography scale defined
- [ ] Radius scale defined
- [ ] Shadow scale defined
- [ ] Spacing scale defined
- [ ] @theme updated
- [ ] Build passes

**Phase 2:**
- [ ] Button uses token-based colors
- [ ] Card uses token-based borders/shadows/radius
- [ ] Input uses token-based borders/shadows/radius
- [ ] Badge uses token-based colors
- [ ] Textarea matches input
- [ ] Select matches input
- [ ] Build passes

**Phase 3:**
- [ ] Header uses token-based colors
- [ ] Footer uses token-based colors
- [ ] Section uses spacing scale
- [ ] Admin header uses token-based colors
- [ ] Admin cards use token-based colors/radius
- [ ] Sidebar uses token-based colors
- [ ] Build passes

**Overall:**
- [ ] Build passes
- [ ] Public site visually coherent
- [ ] Admin site visually coherent
- [ ] No breaking changes
- [ ] Responsive behavior preserved
