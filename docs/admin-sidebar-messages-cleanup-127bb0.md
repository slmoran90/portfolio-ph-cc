# Admin Dashboard Sidebar + Messages Cleanup

Fix desktop sidebar visibility (currently missing), replace hardcoded sidebar profile with real site_settings data, move logout to sidebar footer with Spanish label, and completely remove the unused Messages feature.

## Audit Findings

### Current Layout Issues
- `app/(dashboard)/layout.tsx`: Has a top header with `LogoutButton` positioned on the right. Main content has `lg:ml-64` left margin. Sidebar is included via `<AdminSidebar />`.
- **Desktop sidebar NOT visible**: Content is centered with large empty space on left, sidebar missing despite `lg:static` + `lg:translate-x-0` classes.
- `components/admin/sidebar.tsx`: Has hardcoded profile "Sofia Martinez", "SM" initials, "hello@luminara.com". Logout link in footer uses "Log Out" label. Includes Messages navigation item.
- `components/admin/logout-button.tsx`: Uses Spanish "Cerrar sesión" label, browser client signOut, redirects to `/admin/login`.
- `app/(dashboard)/admin/messages/page.tsx`: Full client component with mock message data. Only messages file.
- `app/(dashboard)/admin/dashboard-client.tsx`: Has hardcoded "Welcome back, Sofia" greeting. No messages references.
- `lib/data/site-settings.ts` + `site-settings.types.ts`: Has `getSiteSettings()` with `full_name`, `profile_image_url`, `email` fields.

## Implementation Plan

### Phase 1: Remove Messages (no dependencies)
- Delete `app/(dashboard)/admin/messages/page.tsx`
- Remove Messages item from `sidebarLinks` in `components/admin/sidebar.tsx`
- Remove `MessageSquare` import from sidebar
- Remove `Mail`, `Archive`, `MailOpen`, `Reply` imports if not used elsewhere (verify via grep)

### Phase 2: Fix Desktop Layout
- **Root cause investigation**: The sidebar uses `lg:static` + `lg:translate-x-0` but is not visible. Likely the flex container or parent layout is incorrect.
- Remove top header with `LogoutButton` from `app/(dashboard)/layout.tsx`
- Ensure sidebar is permanently visible on desktop with proper flex layout
- Main content should sit next to sidebar, not centered
- May need to change from `lg:ml-64` margin to proper flex/grid layout

### Phase 3: Sidebar Profile Data
- Update `app/(dashboard)/layout.tsx` to fetch `getSiteSettings()` server-side
- Pass `siteSettings` as prop to `AdminSidebar` (convert to accept props)
- In sidebar header:
  - Show `profile_image_url` if exists
  - Else show initials: first letter of each word from `full_name`, uppercase, max 2 letters
  - Examples: "Carla Caceres" → "CC", "Sergio Morán" → "SM"
  - Fallback if `full_name` null/empty: "L" for Luminara
- Display real `full_name` instead of hardcoded "Sofia Martinez"
- Remove hardcoded email/hello@luminara.com

### Phase 4: Dashboard Greeting
- Update `app/(dashboard)/admin/dashboard-client.tsx` to accept `siteSettings` prop
- Replace "Welcome back, Sofia" with real `full_name`
- Use first name only (split on space, take first word)
- Example: "Welcome back, Carla. Here's what's happening."
- Fallback if no name: "Welcome back. Here's what's happening."
- Pass `siteSettings` through layout.tsx → dashboard-client.tsx

### Phase 5: Sidebar Footer Logout
- Replace current logout Link with button using browser client signOut (same as `LogoutButton`)
- Change label to "Cerrar sesión"
- Remove name/avatar/email from footer (keep only logout button)
- Keep hover styles (destructive hover)

## Files to Modify
- `app/(dashboard)/layout.tsx` — remove top header, fetch siteSettings, pass to sidebar and dashboard-client
- `components/admin/sidebar.tsx` — accept siteSettings prop, update profile header, remove Messages link, update footer logout
- `app/(dashboard)/admin/dashboard-client.tsx` — accept siteSettings prop, update greeting
- `components/admin/logout-button.tsx` — may be unused after removal from layout (verify)

## Files to Delete
- `app/(dashboard)/admin/messages/page.tsx`

## Risks
- Desktop layout fix requires careful CSS audit — sidebar visibility issue may be in parent container or flex behavior
- Sidebar prop change is breaking — need to update all call sites (layout.tsx only currently)
- If `getSiteSettings()` returns null, need fallback for profile display ("L" initials, generic greeting)
- First name extraction: handle edge cases (single word, multiple spaces, etc.)

## Verification Checklist
- Sidebar permanently visible on desktop, content sits next to it (not centered)
- No Messages navigation item anywhere
- `/admin/messages` route 404s
- Sidebar header shows real profile image or initials from `full_name`
- Sidebar header shows real `full_name`
- Sidebar footer has only "Cerrar sesión" button (no name/avatar/email)
- Top header with LogoutButton removed
- Dashboard greeting uses real first name or fallback
- Build passes
- No dead imports (MessageSquare, Mail, Archive, MailOpen, Reply)
