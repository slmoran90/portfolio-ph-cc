'use client'

import { useState, useRef, useEffect, useMemo, type RefObject } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminCard, EmptyState } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  Star,
  User,
  MessageCircle,
} from 'lucide-react'
import { uploadTestimonialAvatar, deleteTestimonialAvatar } from '@/lib/supabase/storage'
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/lib/actions/testimonials'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
import type { Testimonial } from '@/lib/data/testimonials.types'
import type { Service } from '@/lib/data/services.types'

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024
const NO_SERVICE = '__none__'

type TestimonialDraft = {
  client_name: string
  quote: string
  avatar_url: string | null
  rating: number
  featured: boolean
  enabled: boolean
  sort_order: string
  service_id: string
}

const emptyDraft: TestimonialDraft = {
  client_name: '',
  quote: '',
  avatar_url: null,
  rating: 5,
  featured: false,
  enabled: true,
  sort_order: '',
  service_id: NO_SERVICE,
}

function draftFromTestimonial(t: Testimonial): TestimonialDraft {
  return {
    client_name: t.client_name,
    quote: t.quote,
    avatar_url: t.avatar_url,
    rating: t.rating,
    featured: t.featured,
    enabled: t.enabled,
    sort_order: t.sort_order !== null ? String(t.sort_order) : '',
    service_id: t.service_id ?? NO_SERVICE,
  }
}

function validateDraft(draft: TestimonialDraft): string | null {
  if (!draft.client_name.trim()) return 'El nombre del cliente es obligatorio.'
  if (!draft.quote.trim()) return 'El comentario es obligatorio.'
  if (draft.rating < 1 || draft.rating > 5) return 'La puntuación debe estar entre 1 y 5.'
  return null
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type='button'
          onClick={() => onChange(n)}
          className='focus:outline-none'
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= value
                ? 'fill-champagne text-champagne'
                : 'text-border hover:text-champagne/60'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function AvatarImageField({
  imageUrl,
  fileRef,
  onFileSelect,
  imageUploading,
  onRemove,
}: {
  imageUrl: string | null
  fileRef: RefObject<HTMLInputElement | null>
  onFileSelect: (file: File) => void
  imageUploading: boolean
  onRemove: () => void
}) {
  return (
    <div>
      <Label className='text-sm font-medium mb-1.5 block'>
        Avatar{' '}
        <span className='text-muted-foreground font-normal'>(opcional)</span>
      </Label>
      <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left'>
        <div className='relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-secondary border border-border/50'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt='Avatar'
              fill
              className='object-cover'
              sizes='64px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <User className='w-5 h-5 text-foreground-muted' />
            </div>
          )}
          {imageUploading && (
            <div className='absolute inset-0 bg-background/70 flex items-center justify-center'>
              <Loader2 className='w-3.5 h-3.5 animate-spin text-primary-soft' />
            </div>
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <div className='flex gap-2 flex-wrap'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => fileRef.current?.click()}
              disabled={imageUploading}
            >
              <Upload className='w-3.5 h-3.5 mr-1.5' />
              {imageUrl ? 'Cambiar' : 'Subir'}
            </Button>
            {imageUrl && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={onRemove}
                disabled={imageUploading}
                className='text-destructive border-destructive/30 hover:bg-destructive/10'
              >
                <Trash2 className='w-3.5 h-3.5 mr-1.5' />
                Quitar
              </Button>
            )}
          </div>
          <p className='text-xs text-foreground-muted'>
            JPEG, JPG, PNG, WebP · máx. 10 MB
          </p>
        </div>
        <input
          ref={fileRef}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileSelect(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

function TestimonialForm({
  draft,
  setDraft,
  services,
  fileRef,
  onFileSelect,
  onRemoveAvatar,
  imageUploading,
  saving,
  saveError,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  draft: TestimonialDraft
  setDraft: React.Dispatch<React.SetStateAction<TestimonialDraft>>
  services: Service[]
  fileRef: RefObject<HTMLInputElement | null>
  onFileSelect: (file: File) => void
  onRemoveAvatar: () => void
  imageUploading: boolean
  saving: boolean
  saveError: string | null
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className='space-y-4'>
      <AvatarImageField
        imageUrl={draft.avatar_url}
        fileRef={fileRef}
        onFileSelect={onFileSelect}
        imageUploading={imageUploading}
        onRemove={onRemoveAvatar}
      />

      <div className='space-y-1.5'>
        <Label htmlFor='draft-client-name'>Nombre *</Label>
        <Input
          id='draft-client-name'
          value={draft.client_name}
          onChange={(e) =>
            setDraft((d) => ({ ...d, client_name: e.target.value }))
          }
          placeholder='ej., Emily Thompson'
          className='bg-background border-border/50'
        />
      </div>

      <div className='space-y-1.5'>
        <Label>Servicio</Label>
        <Select
          value={draft.service_id}
          onValueChange={(val) => setDraft((d) => ({ ...d, service_id: val }))}
        >
          <SelectTrigger className='bg-background border-border/50'>
            <SelectValue placeholder='Seleccioná un servicio...' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_SERVICE}>Sin servicio</SelectItem>
            {services.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='draft-quote'>Comentario *</Label>
        <textarea
          id='draft-quote'
          rows={3}
          value={draft.quote}
          onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))}
          placeholder='Lo que dijo el cliente...'
          className='w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>Puntuación</Label>
          <StarRatingInput
            value={draft.rating}
            onChange={(n) => setDraft((d) => ({ ...d, rating: n }))}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='draft-sort'>Orden</Label>
          <Input
            id='draft-sort'
            type='number'
            value={draft.sort_order}
            onChange={(e) =>
              setDraft((d) => ({ ...d, sort_order: e.target.value }))
            }
            placeholder='ej., 1'
            className='bg-background border-border/50'
          />
        </div>
      </div>

      <div className='flex items-center gap-3 flex-wrap'>
        <button
          type='button'
          onClick={() => setDraft((d) => ({ ...d, enabled: !d.enabled }))}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            draft.enabled
              ? 'bg-green-100 border-green-200 text-green-700'
              : 'bg-secondary border-border/50 text-muted-foreground'
          }`}
        >
          {draft.enabled ? (
            <Eye className='w-3.5 h-3.5' />
          ) : (
            <EyeOff className='w-3.5 h-3.5' />
          )}
          {draft.enabled ? 'Habilitado' : 'Deshabilitado'}
        </button>

        <button
          type='button'
          onClick={() => setDraft((d) => ({ ...d, featured: !d.featured }))}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            draft.featured
              ? 'bg-champagne/40 border-champagne/50 text-foreground'
              : 'bg-secondary border-border/50 text-muted-foreground'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${draft.featured ? 'fill-current' : ''}`}
          />
          {draft.featured ? 'Destacado' : 'No destacado'}
        </button>
      </div>

      {saveError && <p className='text-sm text-destructive'>{saveError}</p>}

      <div className='flex gap-2 pt-1'>
        <Button onClick={onSubmit} disabled={saving || imageUploading}>
          {saving ? (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          ) : (
            <Check className='w-4 h-4 mr-2' />
          )}
          {submitLabel}
        </Button>
        <Button variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export default function TestimonialsClient({
  initialTestimonials,
  services,
}: {
  initialTestimonials: Testimonial[]
  services: Service[]
}) {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials)
  const [searchQuery, setSearchQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [createDraft, setCreateDraft] = useState<TestimonialDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<TestimonialDraft>(emptyDraft)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const createFileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)
  const editOriginalAvatarRef = useRef<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setTestimonials(initialTestimonials)
  }, [initialTestimonials])

  const filtered = useMemo(
    () =>
      testimonials.filter(
        (t) =>
          !searchQuery ||
          t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.quote.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [testimonials, searchQuery]
  )

  function validateFile(file: File): string | null {
    if (!ACCEPTED_MIME.includes(file.type))
      return 'Formato no soportado. Usá JPEG, JPG, PNG o WebP.'
    if (file.size > MAX_BYTES) return 'El archivo supera los 10 MB.'
    return null
  }

  async function uploadAvatar(file: File): Promise<string | null> {
    const err = validateFile(file)
    if (err) {
      setSaveError(err)
      return null
    }
    setImageUploading(true)
    try {
      return await uploadTestimonialAvatar(file)
    } catch (e) {
      setSaveError(String(e))
      return null
    } finally {
      setImageUploading(false)
    }
  }

  async function handleCreateImageSelect(file: File) {
    const url = await uploadAvatar(file)
    if (url) setCreateDraft((d) => ({ ...d, avatar_url: url }))
  }

  async function handleEditImageSelect(file: File) {
    const url = await uploadAvatar(file)
    if (url) setEditDraft((d) => ({ ...d, avatar_url: url }))
  }

  function handleRemoveCreateAvatar() {
    if (createDraft.avatar_url) {
      deleteTestimonialAvatar(createDraft.avatar_url).catch(() => {})
    }
    setCreateDraft((d) => ({ ...d, avatar_url: null }))
  }

  function handleRemoveEditAvatar() {
    setEditDraft((d) => ({ ...d, avatar_url: null }))
  }

  async function handleCreate() {
    const err = validateDraft(createDraft)
    if (err) {
      setSaveError(err)
      return
    }
    setSaving(true)
    setSaveError(null)
    const resolvedServiceId =
      createDraft.service_id !== NO_SERVICE ? createDraft.service_id : null
    const result = await createTestimonial({
      client_name: createDraft.client_name.trim(),
      quote: createDraft.quote.trim(),
      avatar_url: createDraft.avatar_url,
      rating: createDraft.rating,
      featured: createDraft.featured,
      enabled: createDraft.enabled,
      sort_order:
        createDraft.sort_order !== '' ? Number(createDraft.sort_order) : null,
      service_id: resolvedServiceId,
    })
    setSaving(false)
    if ('error' in result) {
      setSaveError(result.error)
      return
    }
    const matchedService = resolvedServiceId
      ? (services.find((s) => s.id === resolvedServiceId) ?? null)
      : null
    setTestimonials((prev) => [
      ...prev,
      {
        id: result.id,
        created_at: new Date().toISOString(),
        updated_at: null,
        client_name: createDraft.client_name.trim(),
        quote: createDraft.quote.trim(),
        avatar_url: createDraft.avatar_url,
        rating: createDraft.rating,
        featured: createDraft.featured,
        enabled: createDraft.enabled,
        sort_order:
          createDraft.sort_order !== '' ? Number(createDraft.sort_order) : null,
        service_id: resolvedServiceId,
        service: matchedService,
      },
    ])
    setCreating(false)
    setCreateDraft(emptyDraft)
    router.refresh()
  }

  function handleStartEdit(t: Testimonial) {
    setEditingId(t.id)
    setEditDraft(draftFromTestimonial(t))
    editOriginalAvatarRef.current = t.avatar_url
    setSaveError(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
    editOriginalAvatarRef.current = null
    setSaveError(null)
  }

  async function handleSaveEdit() {
    if (!editingId) return
    const err = validateDraft(editDraft)
    if (err) {
      setSaveError(err)
      return
    }
    setSaving(true)
    setSaveError(null)
    const resolvedServiceId =
      editDraft.service_id !== NO_SERVICE ? editDraft.service_id : null
    const result = await updateTestimonial(editingId, {
      client_name: editDraft.client_name.trim(),
      quote: editDraft.quote.trim(),
      avatar_url: editDraft.avatar_url,
      rating: editDraft.rating,
      featured: editDraft.featured,
      enabled: editDraft.enabled,
      sort_order:
        editDraft.sort_order !== '' ? Number(editDraft.sort_order) : null,
      service_id: resolvedServiceId,
    })
    setSaving(false)
    if (result.error) {
      setSaveError(result.error)
      return
    }

    if (editOriginalAvatarRef.current !== null && editDraft.avatar_url === null) {
      deleteTestimonialAvatar(editOriginalAvatarRef.current).catch(() => {})
    }
    editOriginalAvatarRef.current = null

    const matchedService = resolvedServiceId
      ? (services.find((s) => s.id === resolvedServiceId) ?? null)
      : null
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              client_name: editDraft.client_name.trim(),
              quote: editDraft.quote.trim(),
              avatar_url: editDraft.avatar_url,
              rating: editDraft.rating,
              featured: editDraft.featured,
              enabled: editDraft.enabled,
              sort_order:
                editDraft.sort_order !== ''
                  ? Number(editDraft.sort_order)
                  : null,
              service_id: resolvedServiceId,
              service: matchedService,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    )
    setEditingId(null)
    router.refresh()
  }

  async function handleToggleEnabled(t: Testimonial) {
    const next = !t.enabled
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, enabled: next } : x))
    )
    await updateTestimonial(t.id, {
      client_name: t.client_name,
      quote: t.quote,
      avatar_url: t.avatar_url,
      rating: t.rating,
      featured: t.featured,
      enabled: next,
      sort_order: t.sort_order,
      service_id: t.service_id,
    })
    router.refresh()
  }

  async function handleToggleFeatured(t: Testimonial) {
    const next = !t.featured
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, featured: next } : x))
    )
    await updateTestimonial(t.id, {
      client_name: t.client_name,
      quote: t.quote,
      avatar_url: t.avatar_url,
      rating: t.rating,
      featured: next,
      enabled: t.enabled,
      sort_order: t.sort_order,
      service_id: t.service_id,
    })
    router.refresh()
  }

  function openDeleteDialog(testimonial: Testimonial) {
    setPendingDelete(testimonial)
    setDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteTestimonial(pendingDelete.id, pendingDelete.avatar_url)
      if (result.error) {
        console.error('Delete error:', result.error)
      } else {
        setTestimonials((prev) => prev.filter((t) => t.id !== pendingDelete.id))
        router.refresh()
      }
    } finally {
      setIsDeleting(false)
      setDialogOpen(false)
      setPendingDelete(null)
    }
  }

  return (
    <>
      <AdminHeader
        title='Testimonios'
        description='Administrá los testimonios de clientes que se muestran en la página de inicio'
      />

      <main className='flex-1 p-6 overflow-auto space-y-6'>
        {creating ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-card rounded-2xl border border-border/50 p-6'
          >
            <h3 className='font-serif text-lg font-medium text-foreground mb-4'>
              Nuevo testimonio
            </h3>
            <TestimonialForm
              draft={createDraft}
              setDraft={setCreateDraft}
              services={services}
              fileRef={createFileRef}
              onFileSelect={handleCreateImageSelect}
              onRemoveAvatar={handleRemoveCreateAvatar}
              imageUploading={imageUploading}
              saving={saving}
              saveError={saveError}
              onSubmit={handleCreate}
              onCancel={() => {
                setCreating(false)
                setCreateDraft(emptyDraft)
                setSaveError(null)
              }}
              submitLabel='Crear testimonio'
            />
          </motion.div>
        ) : (
          <div className='flex justify-end sm:justify-end'>
            <Button onClick={() => setCreating(true)} className='w-full sm:w-auto'>
              <Plus className='w-4 h-4 mr-2' />
              Nuevo testimonio
            </Button>
          </div>
        )}

        {/* Search */}
        {testimonials.length > 0 && (
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Buscar por nombre o comentario...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-background border-border/50'
            />
          </div>
        )}

        {/* List */}
        <AdminCard
          title={`Testimonios cargados: ${filtered.length}`}
        >

          {filtered.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title='Aún no hay testimonios'
              description='Agregá tu primer testimonio para mostrarlo en la página de inicio.'
              action={
                <Button onClick={() => setCreating(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  Nuevo testimonio
                </Button>
              }
            />
          ) : (
            <div className='space-y-3'>
              {filtered.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  {editingId === testimonial.id ? (
                    <div className='bg-card rounded-xl border border-border p-5'>
                      <p className='font-medium text-foreground text-sm mb-4'>
                        Editando: {testimonial.client_name}
                      </p>
                      <TestimonialForm
                        draft={editDraft}
                        setDraft={setEditDraft}
                        services={services}
                        fileRef={editFileRef}
                        onFileSelect={handleEditImageSelect}
                        onRemoveAvatar={handleRemoveEditAvatar}
                        imageUploading={imageUploading}
                        saving={saving}
                        saveError={saveError}
                        onSubmit={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        submitLabel='Guardar cambios'
                      />
                    </div>
                  ) : (
                    <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border/80 transition-colors'>
                      <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-secondary'>
                        {testimonial.avatar_url ? (
                          <Image
                            src={testimonial.avatar_url}
                            alt={testimonial.client_name}
                            fill
                            className='object-cover'
                            sizes='48px'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <User className='w-4 h-4 text-muted-foreground' />
                          </div>
                        )}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap mb-1'>
                          <p className='font-medium text-foreground truncate'>
                            {testimonial.client_name}
                          </p>
                          {testimonial.service?.title && (
                            <span className='text-xs text-muted-foreground bg-surface-alt px-2 py-0.5 rounded-full shrink-0'>
                              {testimonial.service.title}
                            </span>
                          )}
                          {testimonial.featured && (
                            <span className='text-xs px-2 py-0.5 rounded-full bg-champagne/40 text-foreground shrink-0'>
                              Destacado
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                              testimonial.enabled
                                ? 'bg-green-100 text-green-700'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {testimonial.enabled ? 'Habilitado' : 'Deshabilitado'}
                          </span>
                        </div>
                        <div className='flex gap-0.5 mb-1'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < testimonial.rating
                                  ? 'fill-champagne text-champagne'
                                  : 'text-border'
                              }`}
                            />
                          ))}
                        </div>
                        <p className='text-sm text-muted-foreground line-clamp-2'>
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                      </div>

                      <div className='flex items-center gap-1.5 shrink-0 sm:items-start justify-start sm:justify-end pt-0.5'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleStartEdit(testimonial)}
                              aria-label='Editar'
                              className='min-w-10 min-h-10'
                            >
                              <Pencil className='w-3.5 h-3.5' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleToggleFeatured(testimonial)}
                              aria-label={testimonial.featured ? 'Quitar destacado' : 'Destacar'}
                              className='min-w-10 min-h-10'
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  testimonial.featured
                                    ? 'fill-current text-champagne'
                                    : ''
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{testimonial.featured ? 'Quitar destacado' : 'Destacar'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleToggleEnabled(testimonial)}
                              aria-label={testimonial.enabled ? 'Deshabilitar' : 'Habilitar'}
                              className='min-w-10 min-h-10'
                            >
                              {testimonial.enabled ? (
                                <EyeOff className='w-3.5 h-3.5' />
                              ) : (
                                <Eye className='w-3.5 h-3.5' />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{testimonial.enabled ? 'Deshabilitar' : 'Habilitar'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-destructive border-destructive/30 hover:bg-destructive/10 min-w-10 min-h-10'
                              onClick={() => openDeleteDialog(testimonial)}
                              aria-label='Eliminar'
                            >
                              <Trash2 className='w-3.5 h-3.5' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}

                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </main>

      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title='¿Eliminar testimonio?'
        description={`¿Eliminar el testimonio de "${pendingDelete?.client_name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </>
  )}
