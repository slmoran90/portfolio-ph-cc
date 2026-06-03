# Phase 1A — Admin Actions Consistency and Delete Confirmations

Unify all admin list action patterns to visible icon buttons and replace every destructive action with a shared `ConfirmDeleteDialog`, while adding global `cursor-pointer` to the shadcn Button component.

---

## 1. Root Causes

1. **Projects is the outlier.** It uses a three-dot `DropdownMenu` while Services/Testimonials use visible `Button` rows. This creates an inconsistent admin UX.
2. **Projects delete is non-functional.** The "Eliminar" `DropdownMenuItem` has no `onClick` handler — it does nothing.
3. **Delete confirmations are inconsistent.** Services/Testimonials use inline banners, Gallery uses an image-card overlay, Projects has no confirmation at all, and Gallery bulk delete fires immediately with zero confirmation.
4. **No shared dialog component.** Each module implements its own confirmation UI, leading to visual and accessibility drift.
5. **Missing cursor-pointer.** The shadcn `Button` component does not set `cursor-pointer`, and Tailwind v4 removes the default browser `cursor: pointer` from `<button>` elements. This makes buttons feel unresponsive.

---

## 2. Safest Fix Strategy

### Guiding principles
- **Preserve all existing logic.** Do not change create, edit, toggle, filter, search, upload, or navigation behavior.
- **Replace UI only.** Swap dropdowns → visible buttons, inline banners → shared dialog, overlay confirmations → shared dialog.
- **One shared component.** Create `components/admin/confirm-delete-dialog.tsx` using the existing `components/ui/alert-dialog.tsx` primitive. This keeps the codebase DRY and ensures consistent accessibility.
- **Global Button fix.** Add `cursor-pointer` and `disabled:cursor-not-allowed` to the shadcn `Button` base variant. This fixes cursor behavior across the entire app without touching individual files.

---

## 3. Exact Files Affected

### New file
- `components/admin/confirm-delete-dialog.tsx`

### Modified files
1. `components/ui/button.tsx` — add `cursor-pointer disabled:cursor-not-allowed` to base variant
2. `app/(dashboard)/admin/projects/projects-list-client.tsx` — remove dropdown, add visible buttons, wire delete via dialog
3. `app/(dashboard)/admin/services/services-client.tsx` — replace inline delete banner with shared dialog
4. `app/(dashboard)/admin/testimonials/testimonials-client.tsx` — replace inline delete banner with shared dialog
5. `app/(dashboard)/admin/gallery/gallery-client.tsx` — replace inline delete overlay with shared dialog, add bulk delete dialog

### Unmodified but verified
- `lib/actions/projects.ts` — `deleteProject(id, slug, imageUrls)` already exists
- `lib/actions/services.ts` — `deleteService(id, imageUrl)` already exists
- `lib/actions/testimonials.ts` — `deleteTestimonial(id, avatarUrl)` already exists
- `lib/actions/gallery.ts` — `deleteGalleryImage(id, imageUrl)` already exists
- `components/ui/alert-dialog.tsx` — already exists and is the correct primitive

---

## 4. Shared Component Design: `ConfirmDeleteDialog`

### API (controlled pattern)
```tsx
interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
}
```

### Behavior
- Uses `AlertDialog` primitive from `components/ui/alert-dialog.tsx`
- Spanish-only copy passed via props
- `confirmLabel` defaults to `"Eliminar"`
- `cancelLabel` defaults to `"Cancelar"`
- `onConfirm` is async-friendly; dialog stays open while `loading` is true
- Destructive action button uses `variant="destructive"`
- Accessible: proper `aria-describedby`, focus trap, Escape to cancel

### Usage pattern in each client
```tsx
const [dialogOpen, setDialogOpen] = useState(false)
const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

function openDeleteDialog(item) {
  setPendingDelete(item)
  setDialogOpen(true)
}

async function handleConfirmDelete() {
  if (!pendingDelete) return
  await deleteAction(...)
  setDialogOpen(false)
  setPendingDelete(null)
  router.refresh()
}
```

---

## 5. Action Button Pattern Per Module

### Unified pattern: "Visible icon buttons, responsive collapse"

**Desktop (`sm:` and up):**
- Primary action: icon + text label (e.g. `Pencil` + "Editar")
- Secondary action: icon-only with `title` tooltip
- Delete: icon-only red button, opens dialog

**Mobile (below `sm:`):**
- All actions: icon-only with `title` tooltip
- Delete: icon-only red button, opens dialog

### Per-module breakdown

| Module | Desktop Actions | Mobile Actions |
|--------|-----------------|----------------|
| **Projects** | `Eye`+"Ver en vivo", `Pencil`+"Editar", `Trash2` icon-only red | `Eye`, `Pencil`, `Trash2` (all icon-only) |
| **Services** | `Pencil`+"Editar", `EyeOff/Eye` icon-only, `Trash2` icon-only red | `Pencil`, `EyeOff/Eye`, `Trash2` (all icon-only) |
| **Testimonials** | `Pencil`+"Editar", `Star` icon-only, `EyeOff/Eye` icon-only, `Trash2` icon-only red | `Pencil`, `Star`, `EyeOff/Eye`, `Trash2` (all icon-only) |
| **Gallery** | No change to selection/star/category controls. Only delete changes from overlay to dialog. | Same. |

**Implementation note:** Use `hidden sm:inline` on text spans and `sm:mr-1.5` on icons to achieve responsive collapse, consistent with the current Services/Testimonials pattern.

---

## 6. Delete Confirmation Migration Path

### Current → Target

| Module | Current | Target |
|--------|---------|--------|
| **Projects** | Dropdown menu item with no handler | Visible red trash button → `ConfirmDeleteDialog` |
| **Services** | Inline banner below row (`deletingId` state + motion.div) | Visible red trash button → `ConfirmDeleteDialog`. Remove `deletingId` state and inline banner JSX. |
| **Testimonials** | Inline banner below row (`deletingId` state + motion.div) | Visible red trash button → `ConfirmDeleteDialog`. Remove `deletingId` state and inline banner JSX. |
| **Gallery** | Inline overlay on image card (`deletingId` state + absolute div) | Visible red trash button → `ConfirmDeleteDialog`. Remove `deletingId` state and overlay JSX. |
| **Gallery bulk** | Immediate delete on button click | Same bulk delete button → `ConfirmDeleteDialog` with count. |

### State cleanup
In Services, Testimonials, and Gallery, remove:
- `deletingId` state
- `setDeletingId` references
- Inline confirmation JSX blocks

Replace with:
- `dialogOpen` state
- `pendingDelete` state (holds item ID and metadata for the dialog)
- `ConfirmDeleteDialog` instance at the bottom of each component

---

## 7. Cursor-Pointer Fix

### `components/ui/button.tsx`
Add to the `buttonVariants` base class string:
```
cursor-pointer disabled:cursor-not-allowed
```

**Why global:** The shadcn Button is used in ~50+ places across the app. Fixing it once is safer and more maintainable than adding `className="cursor-pointer"` to every instance. The `disabled:` variant ensures disabled buttons show `cursor-not-allowed`.

**Raw `<button>` elements in touched files:**
In `gallery-client.tsx`, there are three raw `<button>` elements (checkbox, star, bottom-overlay trash). These should be converted to shadcn `Button` with `variant="ghost"` or `size="icon-sm"` so they inherit the global cursor fix. If conversion is complex, add `className="cursor-pointer"` explicitly as a fallback.

---

## 8. Projects-Specific Changes

### Current state
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
      <MoreHorizontal className='w-4 h-4' />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align='end'>
    <DropdownMenuItem asChild>
      <Link href={`/projects/${project.slug}`} target='_blank'>
        <Eye className='w-4 h-4 mr-2' /> Ver en vivo
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href={`/admin/projects/${project.id}`}>
        <Edit className='w-4 h-4 mr-2' /> Editar
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='text-destructive'>
      <Trash2 className='w-4 h-4 mr-2' /> Eliminar
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Target state
```tsx
<div className='flex items-center gap-1.5 shrink-0'>
  <Button size='sm' variant='outline' asChild>
    <Link href={`/projects/${project.slug}`} target='_blank'>
      <Eye className='w-3.5 h-3.5 sm:mr-1.5' />
      <span className='hidden sm:inline'>Ver en vivo</span>
    </Link>
  </Button>
  <Button size='sm' variant='outline' asChild>
    <Link href={`/admin/projects/${project.id}`}>
      <Pencil className='w-3.5 h-3.5 sm:mr-1.5' />
      <span className='hidden sm:inline'>Editar</span>
    </Link>
  </Button>
  <Button
    size='sm'
    variant='outline'
    className='text-destructive border-destructive/30 hover:bg-destructive/10'
    onClick={() => openDeleteDialog(project)}
  >
    <Trash2 className='w-3.5 h-3.5' />
  </Button>
</div>
```

**Also required:**
- Import `deleteProject` from `lib/actions/projects`
- Add `dialogOpen` / `pendingDelete` state
- Wire `handleConfirmDelete` to call `deleteProject(pendingDelete.id, pendingDelete.slug, pendingDelete.imageUrls)`
- Remove `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator` imports

---

## 9. Gallery-Specific Changes

### Single delete
Replace the inline overlay (`{deletingId === image.id && (...)}` absolute div) with a click on the trash button that opens `ConfirmDeleteDialog`.

The trash button currently lives inside the hover-only bottom overlay. To preserve touch UX, the trash button should remain visible (or at least accessible). Since the user said "Do not redesign gallery cards in this phase," the minimal change is:
1. Keep the bottom overlay but make it always visible on mobile (`group-hover:opacity-100` → `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`)
2. Clicking the trash button opens the shared dialog instead of setting `deletingId`

Actually, even simpler: keep the current overlay behavior, but when trash is clicked, open the dialog. The dialog is a global overlay, so it doesn't matter where the trigger is.

**Recommended approach:**
- Trash button `onClick={() => openDeleteDialog(image)}`
- Remove the entire `{deletingId === image.id && (...)}` inline overlay block
- Dialog copy: `title="¿Eliminar imagen?"`, `description="Esta acción no se puede deshacer."`

### Bulk delete
- Bulk delete button `onClick={() => openBulkDeleteDialog()}`
- Dialog copy: `title="¿Eliminar ${selectedIds.length} imágenes?"`, `description="Esta acción no se puede deshacer."`
- On confirm: run existing `handleBulkDelete` logic (or inline the loop)

---

## 10. Services & Testimonials-Specific Changes

### Services
- Remove `deletingId` state and the inline `{deletingId === service.id && (...)}` motion.div
- Trash button `onClick={() => openDeleteDialog(service)}`
- Dialog copy: `title="¿Eliminar servicio?"`, `description="¿Eliminar '${service.title}'? Esta acción no se puede deshacer."`

### Testimonials
- Remove `deletingId` state and the inline `{deletingId === testimonial.id && (...)}` motion.div
- Trash button `onClick={() => openDeleteDialog(testimonial)}`
- Dialog copy: `title="¿Eliminar testimonio?"`, `description="¿Eliminar el testimonio de '${testimonial.client_name}'? Esta acción no se puede deshacer."`

---

## 11. Risks

| Risk | Level | Mitigation |
|------|-------|------------|
| Projects delete currently non-functional; wiring it makes it destructive | Medium | Confirmation dialog prevents accidental activation |
| Replacing inline confirmations with dialog changes UX feel slightly | Low | Dialog is more accessible and standard; user explicitly requested unified UX |
| Gallery bottom overlay currently hover-only; trash is hidden on mobile | Medium | Keep overlay always visible on mobile, or rely on checkbox selection + bulk delete |
| Global Button cursor change may affect unknown components | Low | `cursor-pointer` is a safe, expected default; `disabled:cursor-not-allowed` is also standard |
| Bulk delete dialog needs item count | Low | Pass dynamic title via props |

---

## 12. Implementation Steps

1. **Create `components/admin/confirm-delete-dialog.tsx`**
   - Import from `components/ui/alert-dialog.tsx`
   - Build controlled component with props: `open`, `onOpenChange`, `title`, `description`, `onConfirm`, `confirmLabel`, `cancelLabel`, `loading`
   - Use Spanish defaults for labels

2. **Fix `components/ui/button.tsx`**
   - Add `cursor-pointer disabled:cursor-not-allowed` to base variant class string

3. **Update `projects-list-client.tsx`**
   - Remove DropdownMenu imports and usage
   - Add visible action buttons (Eye, Pencil, Trash2)
   - Import `deleteProject`
   - Add dialog state and `ConfirmDeleteDialog`
   - Wire delete handler

4. **Update `services-client.tsx`**
   - Remove `deletingId` state and inline confirmation JSX
   - Add dialog state and `ConfirmDeleteDialog`
   - Wire trash button to open dialog
   - Keep all other behavior intact

5. **Update `testimonials-client.tsx`**
   - Remove `deletingId` state and inline confirmation JSX
   - Add dialog state and `ConfirmDeleteDialog`
   - Wire trash button to open dialog
   - Keep all other behavior intact

6. **Update `gallery-client.tsx`**
   - Remove `deletingId` state and inline overlay JSX
   - Add dialog state (single + bulk)
   - Wire single trash button and bulk delete button to open dialog
   - Keep upload, selection, category, featured behavior intact

7. **Run `pnpm build`** and verify no TypeScript or lint errors.

---

## 13. Verification Checklist

- [ ] `ConfirmDeleteDialog` renders with correct Spanish copy
- [ ] Dialog opens when clicking delete on Projects, Services, Testimonials, Gallery (single), Gallery (bulk)
- [ ] Dialog closes when clicking Cancel or pressing Escape
- [ ] Dialog confirms when clicking "Eliminar" and actually deletes the item
- [ ] After delete, the list updates (optimistic or via `router.refresh()`)
- [ ] Projects actions show visible buttons (not dropdown)
- [ ] Projects "Ver en vivo" and "Editar" links still work
- [ ] Services/Testimonials inline confirmations are gone
- [ ] Gallery inline delete overlay is gone
- [ ] Gallery bulk delete shows confirmation with correct count
- [ ] All action buttons show `cursor-pointer` on hover
- [ ] Disabled buttons (e.g., during upload) show `cursor-not-allowed`
- [ ] `pnpm build` passes with no errors
- [ ] No changes to: public frontend, header, contact page, SEO, settings page, auth, routing, design tokens
