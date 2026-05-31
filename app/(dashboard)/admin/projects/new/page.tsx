'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminCard } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { categories } from '@/lib/data/projects.constants'
import { uploadProjectImage } from '@/lib/supabase/storage'
import { createProject } from '@/lib/actions/projects'
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Star,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'

type UploadState = {
  localPreview: string
  url: string
  status: 'uploading' | 'done' | 'error'
  error?: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadState[]>([])
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadSessionId] = useState(() => crypto.randomUUID())

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const initial: UploadState[] = fileArray.map((file) => ({
        localPreview: URL.createObjectURL(file),
        url: '',
        status: 'uploading'
      }))

      setUploadedImages((prev) => {
        const next = [...prev, ...initial]
        return next
      })

      const startIndex = uploadedImages.length

      await Promise.all(
        fileArray.map(async (file, i) => {
          const idx = startIndex + i
          try {
            const url = await uploadProjectImage(uploadSessionId, file)
            setUploadedImages((prev) => {
              const next = [...prev]
              next[idx] = { ...next[idx], url, status: 'done' }
              return next
            })
          } catch (err) {
            setUploadedImages((prev) => {
              const next = [...prev]
              next[idx] = {
                ...next[idx],
                status: 'error',
                error: err instanceof Error ? err.message : 'Upload failed'
              }
              return next
            })
          }
        })
      )
    },
    [uploadSessionId, uploadedImages.length]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
        e.target.value = ''
      }
    },
    [processFiles]
  )

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const removed = prev[index]
      if (coverImageUrl && removed.url === coverImageUrl) {
        setCoverImageUrl(null)
      }
      URL.revokeObjectURL(removed.localPreview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    const formEl = e.currentTarget
    const doneImages = uploadedImages
      .filter((img) => img.status === 'done')
      .map((img) => img.url)

    setIsSubmitting(true)
    try {
      const result = await createProject({
        title: (formEl.elements.namedItem('title') as HTMLInputElement).value,
        category: (formEl.elements.namedItem('category') as HTMLSelectElement)
          .value,
        event_date:
          (
            (formEl.elements.namedItem('event_date') as HTMLInputElement)
              .value + '-01'
          ).length > 3
            ? (formEl.elements.namedItem('event_date') as HTMLInputElement)
                .value + '-01'
            : null,
        location:
          (formEl.elements.namedItem('location') as HTMLInputElement).value ||
          null,
        short_description:
          (
            formEl.elements.namedItem(
              'short_description'
            ) as HTMLTextAreaElement
          ).value || null,
        description:
          (formEl.elements.namedItem('description') as HTMLTextAreaElement)
            .value || null,
        published:
          (formEl.elements.namedItem('published') as HTMLSelectElement)
            .value === 'published',
        images: doneImages,
        cover_image: coverImageUrl,
        featured:
          (formEl.elements.namedItem('featured') as HTMLInputElement)?.checked ??
          false
      })

      if ('error' in result) {
        setSubmitError(result.error)
        return
      }

      router.push('/admin/projects')
    } finally {
      setIsSubmitting(false)
    }
  }

  const doneCount = uploadedImages.filter((i) => i.status === 'done').length

  return (
    <>
      <AdminHeader
        title='New Project'
        description='Create a new photography project'
      />

      <main className='flex-1 p-6 overflow-auto'>
        <Link
          href='/admin/projects'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Projects
        </Link>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <AdminCard title='Project Details'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='title'
                      className='text-sm font-medium'
                    >
                      Project Title *
                    </Label>
                    <Input
                      id='title'
                      name='title'
                      required
                      placeholder="e.g., Emma's Garden Baby Shower"
                      className='h-12 bg-background border-border/50'
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='category'
                        className='text-sm font-medium'
                      >
                        Category *
                      </Label>
                      <select
                        id='category'
                        name='category'
                        required
                        className='w-full h-12 px-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft'
                      >
                        <option value=''>Select a category</option>
                        {categories.slice(1).map((category) => (
                          <option
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='event_date'
                        className='text-sm font-medium'
                      >
                        Event Date
                      </Label>
                      <Input
                        id='event_date'
                        name='event_date'
                        type='month'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='location'
                      className='text-sm font-medium'
                    >
                      Location
                    </Label>
                    <Input
                      id='location'
                      name='location'
                      placeholder='e.g., Botanical Gardens, City Center'
                      className='h-12 bg-background border-border/50'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='short_description'
                      className='text-sm font-medium'
                    >
                      Short Description (SEO / Cards)
                    </Label>
                    <textarea
                      id='short_description'
                      name='short_description'
                      rows={3}
                      placeholder='Brief summary shown on project cards...'
                      className='w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium'
                    >
                      Full Description
                    </Label>
                    <textarea
                      id='description'
                      name='description'
                      rows={6}
                      placeholder='Full story, details, and description of the project...'
                      className='w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none'
                    />
                  </div>
                </div>
              </AdminCard>

              <AdminCard
                title='Project Images'
                description='Upload photos. Click the star icon to set the cover image.'
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  id='file-upload'
                  className='hidden'
                  multiple
                  accept='image/*'
                  onChange={handleFileChange}
                />

                <motion.div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragOver
                      ? 'border-primary-soft bg-champagne/10'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div className='w-14 h-14 mx-auto bg-surface-alt rounded-full flex items-center justify-center mb-4'>
                    <Upload className='w-6 h-6 text-primary-soft' />
                  </div>
                  <p className='text-foreground font-medium mb-2'>
                    Drag and drop images here
                  </p>
                  <p className='text-sm text-foreground-muted mb-4'>
                    or click to browse from your computer
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </motion.div>

                {uploadedImages.length > 0 && (
                  <div className='mt-6'>
                    <p className='text-sm text-foreground-muted mb-4'>
                      Click{' '}
                      <Star className='w-3 h-3 inline text-primary-soft fill-primary-soft' />{' '}
                      to set the cover image.
                    </p>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                      {uploadedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`relative aspect-square rounded-lg overflow-hidden group ${
                            coverImageUrl === image.url && image.status === 'done'
                              ? 'ring-2 ring-primary-soft'
                              : ''
                          }`}
                        >
                          <Image
                            src={image.localPreview}
                            alt={`Upload ${index + 1}`}
                            fill
                            className='object-cover'
                            sizes='150px'
                          />
                          {image.status === 'uploading' && (
                            <div className='absolute inset-0 bg-background/60 flex items-center justify-center'>
                              <Loader2 className='w-6 h-6 text-primary-soft animate-spin' />
                            </div>
                          )}
                          {image.status === 'error' && (
                            <div className='absolute inset-0 bg-destructive/20 flex items-center justify-center'>
                              <p className='text-xs text-destructive font-medium px-2 text-center'>
                                Upload failed
                              </p>
                            </div>
                          )}
                          {image.status === 'done' && (
                            <>
                              <div className='absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors' />
                              <button
                                type='button'
                                onClick={() => setCoverImageUrl(image.url)}
                                title='Set as cover'
                                className={`absolute top-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center transition-opacity ${
                                  coverImageUrl === image.url
                                    ? 'opacity-100 bg-primary-soft'
                                    : 'opacity-0 group-hover:opacity-100 bg-background'
                                }`}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    coverImageUrl === image.url
                                      ? 'text-white fill-white'
                                      : 'text-primary-soft'
                                  }`}
                                />
                              </button>
                              {coverImageUrl === image.url && (
                                <div className='absolute bottom-2 left-2 px-2 py-1 bg-primary-soft rounded text-xs font-medium text-white'>
                                  Cover
                                </div>
                              )}
                            </>
                          )}
                          <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='absolute top-2 right-2 w-8 h-8 bg-destructive rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <X className='w-4 h-4 text-white' />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </AdminCard>
            </div>

            <div className='space-y-6'>
              <AdminCard title='Publish'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Status</Label>
                    <select
                      name='published'
                      className='w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-foreground text-sm'
                    >
                      <option value='draft'>Draft</option>
                      <option value='published'>Published</option>
                    </select>
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      id='featured'
                      name='featured'
                      type='checkbox'
                      className='w-4 h-4 rounded border-border/50 text-primary-soft focus:ring-primary-soft'
                    />
                    <Label htmlFor='featured' className='text-sm font-medium cursor-pointer'>
                      Featured on Home
                    </Label>
                  </div>

                  {submitError && (
                    <p className='text-sm text-destructive'>{submitError}</p>
                  )}
                  <div className='flex gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='flex-1'
                      onClick={() => router.push('/admin/projects')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className='flex-1'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title='Preview'>
                <div className='space-y-3'>
                  <div className='aspect-[4/5] rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden'>
                    {coverImageUrl ? (
                      <Image
                        src={coverImageUrl}
                        alt='Cover preview'
                        width={200}
                        height={250}
                        className='w-full h-full object-cover rounded-lg'
                      />
                    ) : uploadedImages.find(
                        (i) => i.status === 'done'
                      )?.localPreview ? (
                      <div className='w-full h-full relative'>
                        <Image
                          src={
                            uploadedImages.find((i) => i.status === 'done')!
                              .localPreview
                          }
                          alt='First image preview'
                          fill
                          className='object-cover rounded-lg opacity-50'
                          sizes='200px'
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <p className='text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded'>
                            No cover set
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center gap-2'>
                        <ImageIcon className='w-8 h-8 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          No cover image
                        </p>
                      </div>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {doneCount} image{doneCount !== 1 ? 's' : ''} uploaded
                  </p>
                </div>
              </AdminCard>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
