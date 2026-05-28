'use client'

import { useState, useRef, useEffect, useMemo, type RefObject } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminCard, EmptyState } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  Layers
} from 'lucide-react'
import { uploadServiceImage } from '@/lib/supabase/storage'
import {
  createService,
  updateService,
  deleteService
} from '@/lib/actions/services'
import type { Service } from '@/lib/data/services.types'

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024

type ServiceDraft = {
  title: string
  description: string
  image_url: string | null
  enabled: boolean
  sort_order: string
}

const emptyDraft: ServiceDraft = {
  title: '',
  description: '',
  image_url: null,
  enabled: true,
  sort_order: ''
}

function draftFromService(s: Service): ServiceDraft {
  return {
    title: s.title,
    description: s.description ?? '',
    image_url: s.image_url,
    enabled: s.enabled,
    sort_order: s.sort_order !== null ? String(s.sort_order) : ''
  }
}

function ServiceImageField({
  imageUrl,
  fileRef,
  onFileSelect,
  imageUploading
}: {
  imageUrl: string | null
  fileRef: RefObject<HTMLInputElement | null>
  onFileSelect: (file: File) => void
  imageUploading: boolean
}) {
  return (
    <div>
      <Label className='text-sm font-medium mb-1.5 block'>Image</Label>
      <div className='flex items-center gap-3'>
        <div className='relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-secondary border border-border/50'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt='Service image'
              fill
              className='object-cover'
              sizes='80px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <ImageIcon className='w-5 h-5 text-muted-foreground' />
            </div>
          )}
          {imageUploading && (
            <div className='absolute inset-0 bg-background/70 flex items-center justify-center'>
              <Loader2 className='w-4 h-4 animate-spin text-dusty-rose' />
            </div>
          )}
        </div>
        <div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => fileRef.current?.click()}
            disabled={imageUploading}
          >
            <Upload className='w-3.5 h-3.5 mr-1.5' />
            {imageUrl ? 'Change Image' : 'Upload Image'}
          </Button>
          <p className='text-xs text-muted-foreground mt-1'>
            JPEG, PNG, WebP, AVIF · max 10 MB
          </p>
        </div>
        <input
          ref={fileRef}
          type='file'
          accept='image/jpeg,image/png,image/webp,image/avif'
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

export default function ServicesClient({
  initialServices
}: {
  initialServices: Service[]
}) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [searchQuery, setSearchQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [createDraft, setCreateDraft] = useState<ServiceDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<ServiceDraft | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const createFileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setServices(initialServices)
  }, [initialServices])

  const filtered = useMemo(
    () =>
      services.filter(
        (s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [services, searchQuery]
  )

  function validateFile(file: File): string | null {
    if (!ACCEPTED_MIME.includes(file.type))
      return 'Unsupported format. Use JPEG, PNG, WebP, or AVIF.'
    if (file.size > MAX_BYTES) return 'File exceeds 10 MB.'
    return null
  }

  async function uploadImage(file: File): Promise<string | null> {
    const err = validateFile(file)
    if (err) {
      setSaveError(err)
      return null
    }
    setImageUploading(true)
    try {
      const url = await uploadServiceImage(`svc-${Date.now()}`, file)
      return url
    } catch (e) {
      setSaveError(String(e))
      return null
    } finally {
      setImageUploading(false)
    }
  }

  async function handleCreateImageSelect(file: File) {
    const url = await uploadImage(file)
    if (url) setCreateDraft((d) => ({ ...d, image_url: url }))
  }

  async function handleEditImageSelect(file: File) {
    const url = await uploadImage(file)
    if (url) setEditDraft((d) => d ? { ...d, image_url: url } : d)
  }

  async function handleCreate() {
    if (!createDraft.title.trim()) return
    setSaving(true)
    setSaveError(null)
    const result = await createService({
      title: createDraft.title.trim(),
      description: createDraft.description.trim() || null,
      image_url: createDraft.image_url,
      enabled: createDraft.enabled,
      sort_order: createDraft.sort_order !== '' ? Number(createDraft.sort_order) : null
    })
    setSaving(false)
    if ('error' in result) {
      setSaveError(result.error)
      return
    }
    setServices((prev) => [
      ...prev,
      {
        id: result.id,
        slug: result.slug,
        created_at: new Date().toISOString(),
        updated_at: null,
        title: createDraft.title.trim(),
        description: createDraft.description.trim() || null,
        image_url: createDraft.image_url,
        enabled: createDraft.enabled,
        sort_order: createDraft.sort_order !== '' ? Number(createDraft.sort_order) : null
      }
    ])
    setCreating(false)
    setCreateDraft(emptyDraft)
    router.refresh()
  }

  function handleStartEdit(service: Service) {
    setEditingId(service.id)
    setEditDraft(draftFromService(service))
    setSaveError(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditDraft(null)
    setSaveError(null)
  }

  async function handleSaveEdit() {
    if (!editingId || !editDraft) return
    if (!editDraft.title.trim()) return
    setSaving(true)
    setSaveError(null)
    const result = await updateService(editingId, {
      title: editDraft.title.trim(),
      description: editDraft.description.trim() || null,
      image_url: editDraft.image_url,
      enabled: editDraft.enabled,
      sort_order: editDraft.sort_order !== '' ? Number(editDraft.sort_order) : null
    })
    setSaving(false)
    if (result.error) {
      setSaveError(result.error)
      return
    }
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              title: editDraft.title.trim(),
              description: editDraft.description.trim() || null,
              image_url: editDraft.image_url,
              enabled: editDraft.enabled,
              sort_order: editDraft.sort_order !== '' ? Number(editDraft.sort_order) : null,
              updated_at: new Date().toISOString()
            }
          : s
      )
    )
    setEditingId(null)
    setEditDraft(null)
    router.refresh()
  }

  async function handleToggleEnabled(service: Service) {
    const next = !service.enabled
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, enabled: next } : s))
    )
    await updateService(service.id, {
      title: service.title,
      description: service.description,
      image_url: service.image_url,
      enabled: next,
      sort_order: service.sort_order
    })
    router.refresh()
  }

  async function handleDelete(id: string, imageUrl: string | null) {
    setDeletingId(null)
    setServices((prev) => prev.filter((s) => s.id !== id))
    await deleteService(id, imageUrl)
    router.refresh()
  }

  return (
    <>
      <AdminHeader
        title='Services'
        description='Manage the services displayed on the homepage'
      />

      <main className='flex-1 p-6 overflow-auto space-y-6'>
        {/* Create form */}
        {creating ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-card rounded-2xl border border-border/50 p-6 space-y-4'
          >
            <h3 className='font-serif text-lg font-medium text-foreground'>
              New Service
            </h3>

            <ServiceImageField
              imageUrl={createDraft.image_url}
              fileRef={createFileRef}
              onFileSelect={handleCreateImageSelect}
              imageUploading={imageUploading}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='create-title'>Title *</Label>
                <Input
                  id='create-title'
                  value={createDraft.title}
                  onChange={(e) =>
                    setCreateDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder='e.g. Baby Shower'
                  className='bg-background border-border/50'
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='create-sort'>Sort Order</Label>
                <Input
                  id='create-sort'
                  type='number'
                  value={createDraft.sort_order}
                  onChange={(e) =>
                    setCreateDraft((d) => ({
                      ...d,
                      sort_order: e.target.value
                    }))
                  }
                  placeholder='e.g. 1'
                  className='bg-background border-border/50'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='create-desc'>Description</Label>
              <textarea
                id='create-desc'
                rows={3}
                value={createDraft.description}
                onChange={(e) =>
                  setCreateDraft((d) => ({
                    ...d,
                    description: e.target.value
                  }))
                }
                placeholder='Short description visible on the homepage'
                className='w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none'
              />
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() =>
                  setCreateDraft((d) => ({ ...d, enabled: !d.enabled }))
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  createDraft.enabled
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-secondary border-border/50 text-muted-foreground'
                }`}
              >
                {createDraft.enabled ? (
                  <Eye className='w-3.5 h-3.5' />
                ) : (
                  <EyeOff className='w-3.5 h-3.5' />
                )}
                {createDraft.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {saveError && (
              <p className='text-sm text-destructive'>{saveError}</p>
            )}

            <div className='flex gap-2 pt-1'>
              <Button onClick={handleCreate} disabled={saving || imageUploading}>
                {saving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Check className='w-4 h-4 mr-2' />
                )}
                Create Service
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setCreating(false)
                  setCreateDraft(emptyDraft)
                  setSaveError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className='flex justify-end'>
            <Button onClick={() => setCreating(true)}>
              <Plus className='w-4 h-4 mr-2' />
              New Service
            </Button>
          </div>
        )}

        {/* Search + list */}
        <AdminCard
          title={`${filtered.length} Service${filtered.length !== 1 ? 's' : ''}`}
        >
          {services.length > 0 && (
            <div className='relative mb-4'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search services...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 bg-background border-border/50'
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon={Layers}
              title='No services yet'
              description='Create your first service to display it on the homepage.'
              action={
                <Button onClick={() => setCreating(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  New Service
                </Button>
              }
            />
          ) : (
            <div className='space-y-3'>
              {filtered.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  {editingId === service.id && editDraft ? (
                    /* ── Edit form ── */
                    <div className='bg-card rounded-xl border border-border p-5 space-y-4'>
                      <p className='font-medium text-foreground text-sm'>
                        Editing: {service.title}
                      </p>

                      <ServiceImageField
                        imageUrl={editDraft.image_url}
                        fileRef={editFileRef}
                        onFileSelect={handleEditImageSelect}
                        imageUploading={imageUploading}
                      />

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-1.5'>
                          <Label htmlFor={`edit-title-${service.id}`}>
                            Title *
                          </Label>
                          <Input
                            id={`edit-title-${service.id}`}
                            value={editDraft.title}
                            onChange={(e) =>
                              setEditDraft((d) =>
                                d ? { ...d, title: e.target.value } : d
                              )
                            }
                            className='bg-background border-border/50'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor={`edit-sort-${service.id}`}>
                            Sort Order
                          </Label>
                          <Input
                            id={`edit-sort-${service.id}`}
                            type='number'
                            value={editDraft.sort_order}
                            onChange={(e) =>
                              setEditDraft((d) =>
                                d ? { ...d, sort_order: e.target.value } : d
                              )
                            }
                            className='bg-background border-border/50'
                          />
                        </div>
                      </div>

                      <div className='space-y-1.5'>
                        <Label htmlFor={`edit-desc-${service.id}`}>
                          Description
                        </Label>
                        <textarea
                          id={`edit-desc-${service.id}`}
                          rows={3}
                          value={editDraft.description}
                          onChange={(e) =>
                            setEditDraft((d) =>
                              d ? { ...d, description: e.target.value } : d
                            )
                          }
                          className='w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none'
                        />
                      </div>

                      <div className='flex items-center gap-3'>
                        <button
                          type='button'
                          onClick={() =>
                            setEditDraft((d) =>
                              d ? { ...d, enabled: !d.enabled } : d
                            )
                          }
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            editDraft.enabled
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-secondary border-border/50 text-muted-foreground'
                          }`}
                        >
                          {editDraft.enabled ? (
                            <Eye className='w-3.5 h-3.5' />
                          ) : (
                            <EyeOff className='w-3.5 h-3.5' />
                          )}
                          {editDraft.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      {saveError && (
                        <p className='text-sm text-destructive'>{saveError}</p>
                      )}

                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          onClick={handleSaveEdit}
                          disabled={saving || imageUploading}
                        >
                          {saving ? (
                            <Loader2 className='w-3.5 h-3.5 mr-1.5 animate-spin' />
                          ) : (
                            <Check className='w-3.5 h-3.5 mr-1.5' />
                          )}
                          Save
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ── View card ── */
                    <div className='flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border/80 transition-colors'>
                      {/* Thumbnail */}
                      <div className='relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-secondary'>
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className='object-cover'
                            sizes='64px'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='w-5 h-5 text-muted-foreground' />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <p className='font-medium text-foreground truncate'>
                            {service.title}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                              service.enabled
                                ? 'bg-green-100 text-green-700'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {service.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          {service.sort_order !== null && (
                            <span className='text-xs text-muted-foreground'>
                              #{service.sort_order}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                            {service.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className='flex items-center gap-1.5 shrink-0'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleStartEdit(service)}
                        >
                          <Pencil className='w-3.5 h-3.5 sm:mr-1.5' />
                          <span className='hidden sm:inline'>Edit</span>
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleToggleEnabled(service)}
                          title={service.enabled ? 'Disable' : 'Enable'}
                        >
                          {service.enabled ? (
                            <EyeOff className='w-3.5 h-3.5' />
                          ) : (
                            <Eye className='w-3.5 h-3.5' />
                          )}
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-destructive border-destructive/30 hover:bg-destructive/10'
                          onClick={() => setDeletingId(service.id)}
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Delete confirmation */}
                  {deletingId === service.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-1 p-3 bg-destructive/10 rounded-xl border border-destructive/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'
                    >
                      <p className='text-sm font-medium text-destructive'>
                        Delete &ldquo;{service.title}&rdquo;? This cannot be undone.
                      </p>
                      <div className='flex gap-2 shrink-0'>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() =>
                            handleDelete(service.id, service.image_url)
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </main>
    </>
  )
}
