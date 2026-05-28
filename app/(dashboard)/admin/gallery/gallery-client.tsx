'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdminHeader, AdminCard, EmptyState } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Search, Trash2, Image as ImageIcon, Check, X, Star } from 'lucide-react'
import { categories } from '@/lib/data/projects.constants'
import { uploadGalleryImage } from '@/lib/supabase/storage'
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '@/lib/actions/gallery'
import type { GalleryImage } from '@/lib/data/gallery.types'

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024
const IMAGE_CATEGORIES = categories.filter((c) => c.value !== 'all')

interface UploadItem {
  tempId: string
  fileName: string
  previewUrl: string
  status: 'uploading' | 'error'
  error?: string
}

export default function GalleryClient({
  initialImages
}: {
  initialImages: GalleryImage[]
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sessionId = useRef(`gallery-${Date.now()}`)
  const router = useRouter()

  useEffect(() => {
    if (uploadQueue.length === 0) {
      setImages(initialImages)
    }
  }, [initialImages])

  const filteredImages = useMemo(
    () =>
      images.filter((img) => {
        const q = searchQuery.toLowerCase()
        return (
          !q ||
          img.title?.toLowerCase().includes(q) ||
          img.category?.toLowerCase().includes(q)
        )
      }),
    [images, searchQuery]
  )

  function validateFile(file: File): string | null {
    if (!ACCEPTED_MIME.includes(file.type)) return 'Unsupported format (JPEG, PNG, WebP, AVIF only)'
    if (file.size > MAX_BYTES) return 'File exceeds 10 MB limit'
    return null
  }

  async function processFiles(files: File[]) {
    for (const file of files) {
      const validationError = validateFile(file)
      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const previewUrl = URL.createObjectURL(file)

      if (validationError) {
        setUploadQueue((prev) => [
          ...prev,
          { tempId, fileName: file.name, previewUrl, status: 'error', error: validationError }
        ])
        continue
      }

      setUploadQueue((prev) => [
        ...prev,
        { tempId, fileName: file.name, previewUrl, status: 'uploading' }
      ])

      try {
        const imageUrl = await uploadGalleryImage(sessionId.current, file)
        const result = await createGalleryImage(imageUrl, {
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          category: null,
          featured: false,
          sort_order: null
        })

        if ('error' in result) {
          setUploadQueue((prev) =>
            prev.map((u) =>
              u.tempId === tempId ? { ...u, status: 'error', error: result.error } : u
            )
          )
        } else {
          URL.revokeObjectURL(previewUrl)
          setUploadQueue((prev) => prev.filter((u) => u.tempId !== tempId))
          setImages((prev) => [
            {
              id: result.id,
              created_at: new Date().toISOString(),
              updated_at: null,
              title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
              category: null,
              image_url: imageUrl,
              featured: false,
              sort_order: null
            },
            ...prev
          ])
          router.refresh()
        }
      } catch (err) {
        setUploadQueue((prev) =>
          prev.map((u) =>
            u.tempId === tempId
              ? { ...u, status: 'error', error: String(err) }
              : u
          )
        )
      }
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(Array.from(e.dataTransfer.files))
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  async function handleToggleFeatured(img: GalleryImage) {
    const next = !img.featured
    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, featured: next } : i))
    )
    await updateGalleryImage(img.id, {
      title: img.title,
      category: img.category,
      featured: next,
      sort_order: img.sort_order
    })
    router.refresh()
  }

  async function handleCategoryChange(img: GalleryImage, category: string) {
    const val = category || null
    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, category: val } : i))
    )
    await updateGalleryImage(img.id, {
      title: img.title,
      category: val,
      featured: img.featured,
      sort_order: img.sort_order
    })
    router.refresh()
  }

  async function confirmDelete(id: string, imageUrl: string) {
    setDeletingId(null)
    setImages((prev) => prev.filter((i) => i.id !== id))
    await deleteGalleryImage(id, imageUrl)
    router.refresh()
  }

  async function handleBulkDelete() {
    setBulkDeleting(true)
    const toDelete = images.filter((i) => selectedIds.includes(i.id))
    setImages((prev) => prev.filter((i) => !selectedIds.includes(i.id)))
    setSelectedIds([])
    for (const img of toDelete) {
      await deleteGalleryImage(img.id, img.image_url)
    }
    setBulkDeleting(false)
    router.refresh()
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredImages.length && filteredImages.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredImages.map((i) => i.id))
    }
  }

  const allSelected =
    filteredImages.length > 0 && selectedIds.length === filteredImages.length

  return (
    <>
      <AdminHeader title='Gallery' description='Manage your media library' />

      <main className='flex-1 p-6 overflow-auto'>
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all ${
            dragOver
              ? 'border-dusty-rose bg-champagne/10'
              : 'border-border/50 hover:border-border bg-card'
          }`}
        >
          <div className='w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center mb-4'>
            <Upload className='w-6 h-6 text-dusty-rose' />
          </div>
          <p className='text-foreground font-medium mb-2'>
            Drag and drop images to upload
          </p>
          <p className='text-sm text-muted-foreground mb-4'>
            JPEG, PNG, WebP, AVIF — up to 10 MB each
          </p>
          <Button variant='outline' onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/avif'
            multiple
            className='hidden'
            onChange={handleFileInput}
          />
        </motion.div>

        {/* Toolbar */}
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search by title or category...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-background border-border/50'
            />
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={toggleSelectAll}>
              {allSelected ? (
                <><X className='w-4 h-4 mr-2' />Deselect All</>
              ) : (
                <><Check className='w-4 h-4 mr-2' />Select All</>
              )}
            </Button>
            {selectedIds.length > 0 && (
              <Button
                variant='outline'
                className='text-destructive border-destructive/50 hover:bg-destructive/10'
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Grid */}
        <AdminCard
          title={`${filteredImages.length + uploadQueue.length} Images`}
        >
          {filteredImages.length === 0 && uploadQueue.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title='No images yet'
              description='Upload images to build your gallery.'
              action={
                <Button onClick={() => fileInputRef.current?.click()}>
                  Upload Images
                </Button>
              }
            />
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
              {/* Upload queue items */}
              {uploadQueue.map((item) => (
                <div key={item.tempId} className='relative aspect-square rounded-lg overflow-hidden bg-secondary/50'>
                  <Image
                    src={item.previewUrl}
                    alt={item.fileName}
                    fill
                    className='object-cover opacity-60'
                    sizes='16vw'
                  />
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    {item.status === 'uploading' ? (
                      <div className='w-6 h-6 border-2 border-dusty-rose border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <>
                        <X className='w-5 h-5 text-destructive mb-1' />
                        <p className='text-xs text-destructive text-center px-2 leading-tight'>
                          {item.error}
                        </p>
                        <button
                          className='mt-2 text-xs text-white/70 underline'
                          onClick={() => {
                            URL.revokeObjectURL(item.previewUrl)
                            setUploadQueue((prev) =>
                              prev.filter((u) => u.tempId !== item.tempId)
                            )
                          }}
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Existing images */}
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={`relative aspect-square rounded-lg overflow-hidden group ${
                    selectedIds.includes(image.id)
                      ? 'ring-2 ring-dusty-rose ring-offset-2'
                      : ''
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.title ?? 'Gallery image'}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw'
                  />

                  {/* Hover overlay */}
                  <div
                    className={`absolute inset-0 transition-colors ${
                      selectedIds.includes(image.id)
                        ? 'bg-dusty-rose/20'
                        : 'bg-foreground/0 group-hover:bg-foreground/30'
                    }`}
                  />

                  {/* Checkbox */}
                  <button
                    className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedIds.includes(image.id)
                        ? 'bg-dusty-rose border-dusty-rose opacity-100'
                        : 'bg-background/80 border-background/80 opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={() => toggleSelect(image.id)}
                    aria-label='Select image'
                  >
                    {selectedIds.includes(image.id) && (
                      <Check className='w-3 h-3 text-white' />
                    )}
                  </button>

                  {/* Featured star */}
                  <button
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      image.featured
                        ? 'bg-amber-400 opacity-100'
                        : 'bg-background/80 opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={() => handleToggleFeatured(image)}
                    aria-label={image.featured ? 'Unfeature' : 'Feature'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${image.featured ? 'text-white fill-white' : 'text-foreground'}`}
                    />
                  </button>

                  {/* Bottom overlay */}
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='flex items-center justify-between gap-1'>
                      <select
                        value={image.category ?? ''}
                        onChange={(e) => handleCategoryChange(image, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className='text-xs bg-transparent text-white flex-1 min-w-0 outline-none cursor-pointer'
                        aria-label='Category'
                      >
                        <option value=''>No category</option>
                        {IMAGE_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value} className='text-foreground bg-background'>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setDeletingId(image.id)}
                        className='shrink-0 text-white/80 hover:text-white transition-colors'
                        aria-label='Delete'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  {deletingId === image.id && (
                    <div className='absolute inset-0 bg-foreground/90 flex flex-col items-center justify-center gap-2 p-3'>
                      <p className='text-white text-xs text-center font-medium'>
                        Delete this image?
                      </p>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          variant='destructive'
                          className='h-7 text-xs px-3'
                          onClick={() => confirmDelete(image.id, image.image_url)}
                        >
                          Delete
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='h-7 text-xs px-3 bg-transparent text-white border-white/50 hover:bg-white/10'
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
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
