# Phase 14 — Public UX Polish Plan (Reduced Scope)

This plan implements hero cinematic enhancement and scroll-state header to provide the highest visual impact with the lowest risk while maintaining persistent navigation.

## Scope

**This branch implements ONLY:**
- Phase 1: Hero Enhancement
- Phase 5: Scroll-state Header (persistent, not hide/show)

**Deferred to future branches:**
- Project card polish
- Gallery enhancement
- Testimonial polish
- About page polish
- CTA/Footer polish

## Exact Files Affected

**Phase 1 — Hero Enhancement:**
- `components/home/hero-section.tsx`

**Phase 5 — Scroll-state Header:**
- `components/layout/header.tsx`

**Total files:** 2

## Phase 1: Hero Enhancement

### Motion Strategy

**Parallax Background:**
- Use `useScroll` from Framer Motion to track scroll position
- Apply `useTransform` to map scroll Y to translateY on hero image
- Range: 0 to 100px vertical movement
- Smooth easing with scroll dampening
- Subtle and gentle to avoid harming readability

**Enhanced Gradient Overlay:**
- Add second gradient layer with different opacity
- Animate gradient opacity based on scroll position
- Fade from 60%/30% to 80%/50% as user scrolls
- Ensure text remains readable throughout transition

**Content Fade on Scroll:**
- Track scroll position relative to hero section
- Fade out hero content (overline, heading, description, buttons) as user scrolls past
- Use opacity transform based on scroll threshold (0-300px)
- Subtle fade (opacity 1 → 0.6) to maintain readability
- Complete fade only after user has scrolled past hero

**Improved Scroll Indicator:**
- Replace basic bounce with more elegant animation
- Add subtle pulse effect to the dot
- Fade out indicator after initial scroll (300px)

### Mobile Behavior

**Parallax:**
- Disable parallax on mobile (screen width < 768px)
- Static background image on mobile for performance
- Keep gradient overlay but simplified

**Content Fade:**
- Same fade behavior on mobile
- Adjust scroll threshold for smaller screens (0-200px)
- Ensure readability is maintained

**Scroll Indicator:**
- Keep on mobile with same animation
- Smaller size if needed for space

### Performance Considerations

- Use `will-change: transform` on hero image only during scroll
- Remove `will-change` when not scrolling to avoid paint thrashing
- Use `requestAnimationFrame` for smooth scroll tracking
- Disable parallax on low-end devices via `prefers-reduced-motion`
- Use CSS transforms (translateY) instead of top/bottom for GPU acceleration
- Ensure hero image has proper `sizes` attribute for responsive loading

### Accessibility Considerations

- Respect `prefers-reduced-motion` media query — disable all animations
- Ensure content remains readable with gradient overlay changes
- Maintain keyboard navigation — scroll indicator not interactive
- No content is hidden from screen readers during fade animations
- Ensure contrast ratios remain WCAG AA compliant with enhanced gradients
- Content fade should not harm readability (max opacity 0.6 during transition)

## Phase 5: Scroll-state Header

### Motion Strategy

**Persistent Header (No Hide/Show):**
- Header remains sticky/visible at all times
- No hide on scroll down, no show on scroll up
- Two states based on scroll position: top vs scrolled

**Top State (Scroll < 50px):**
- Transparent background (bg-background/0)
- Minimal or no backdrop blur
- No border or shadow
- Light, unobtrusive appearance

**Scrolled State (Scroll ≥ 50px):**
- Backdrop blur (backdrop-blur-md)
- Soft surface background (bg-background/80 or bg-surface-alt/80)
- Subtle border (border-border/50)
- Subtle shadow (shadow-sm)
- Smooth transition between states (0.3s ease-out)

**Active State Indication:**
- Add underline indicator to current page link
- Animate underline width from 0 to 100% on hover/active
- Use Framer Motion `layout` prop for smooth width transition
- Preserve in both top and scrolled states

**Mobile Menu Animation:**
- Enhance slide-down with backdrop blur fade-in
- Add staggered animation to menu items (0.05s delay between items)
- Smooth backdrop blur transition (0.3s)
- Preserve hamburger button behavior

### Mobile Behavior

**Scroll State:**
- Same top/scrolled logic on mobile
- Adjust threshold for touch scrolling (30px)
- Ensure header doesn't interfere with content
- Backdrop blur works on mobile browsers

**Mobile Menu:**
- Keep enhanced staggered animation
- Ensure backdrop blur works on mobile browsers
- Test touch targets (minimum 44px)
- Preserve hamburger toggle behavior

### Performance Considerations

- Use CSS transitions for background/border/shadow changes
- Avoid layout thrashing — use transform and opacity
- Debounce scroll events to avoid excessive calculations
- Use GPU-accelerated properties (backdrop-filter, transform)
- Test on mobile for scroll performance
- Minimal impact since no hide/show animation

### Accessibility Considerations

- Respect `prefers-reduced-motion` — disable state transitions
- Header remains visible at all times (no keyboard navigation issues)
- Skip to content link should still work
- Active state indication should have proper ARIA attributes
- Mobile menu should be keyboard accessible
- Ensure sufficient contrast on active states in both header states
- Backdrop blur should not affect readability

## Verification Checklist

### Hero Enhancement
- [ ] Parallax effect works on desktop (0-100px movement)
- [ ] Parallax is disabled on mobile (< 768px)
- [ ] Gradient overlay enhances as user scrolls
- [ ] Hero content fades subtly (opacity 1 → 0.6) during scroll
- [ ] Hero content fades completely after passing hero section
- [ ] Text remains readable throughout all transitions
- [ ] Scroll indicator has elegant pulse animation
- [ ] Scroll indicator fades out after 300px scroll
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Contrast ratios remain WCAG AA compliant
- [ ] No layout shifts during animations
- [ ] Performance is smooth (60fps) on desktop

### Scroll-state Header
- [ ] Header remains visible at all times (no hide/show)
- [ ] Top state: transparent background, no blur/border/shadow
- [ ] Scrolled state: backdrop blur, surface background, border, shadow
- [ ] Transition between states is smooth (0.3s)
- [ ] Scroll threshold is 50px (desktop), 30px (mobile)
- [ ] Active state has underline indicator
- [ ] Underline animates smoothly on hover
- [ ] Active state works in both top and scrolled states
- [ ] Mobile menu has staggered item animation
- [ ] Mobile menu backdrop blur works
- [ ] State transitions respect `prefers-reduced-motion`
- [ ] Header is always keyboard accessible
- [ ] Skip to content link still works
- [ ] Contrast is sufficient in both states
- [ ] Performance is smooth (60fps)

### Cross-Check
- [ ] Build passes (`pnpm build`)
- [ ] No admin files modified
- [ ] No logic/data files modified
- [ ] No CMS/Supabase files modified
- [ ] No routing files modified
- [ ] No content/copy changes
- [ ] No color changes
- [ ] Only 2 files modified total
- [ ] Visual check: hero feels more cinematic
- [ ] Visual check: header feels premium and persistent
- [ ] Visual check: transitions are smooth

## Risks

1. **Performance:** Parallax and scroll tracking may impact performance on low-end devices
   - Mitigation: Disable on mobile, respect `prefers-reduced-motion`, use GPU acceleration

2. **Layout shifts:** Header state changes could cause content jump
   - Mitigation: Use fixed positioning, avoid layout property changes, use transforms only

3. **Mobile experience:** Parallax may not work well on mobile browsers
   - Mitigation: Disable parallax on mobile, keep static background

4. **Accessibility:** Backdrop blur may affect readability for some users
   - Mitigation: Ensure sufficient contrast, respect `prefers-reduced-motion`, test with screen readers

5. **Browser compatibility:** Backdrop-filter may not work in older browsers
   - Mitigation: Provide fallback background color, test cross-browser

6. **Readability:** Content fade on hero could harm readability
   - Mitigation: Keep fade subtle (max 0.6 opacity), complete fade only after passing hero, test contrast

## Implementation Order

1. **Phase 1: Hero Enhancement** — First impression is critical
2. **Phase 5: Scroll-state Header** — Navigation improvement

## Files Not to Touch

- All admin files (`app/(dashboard)/*`, `components/admin/*`)
- Project card files (`components/site/project-card.tsx`)
- Gallery files (`app/(site)/gallery/*`, `components/site/image-lightbox.tsx`)
- Testimonial files (`components/home/testimonials-section.tsx`)
- About page files (`app/(site)/about/*`)
- CTA files (`components/home/cta-section.tsx`)
- Footer files (`components/layout/footer.tsx`)
- Category filter files (`components/site/category-filter.tsx`)
- CMS logic files
- Supabase/data/actions/storage files
- Auth/demo mode files
- Routing files
