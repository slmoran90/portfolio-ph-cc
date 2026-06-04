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
                error: err instanceof Error ? err.message : 'Error al subir'
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
        title='Nuevo proyecto'
        description='Creá un proyecto de fotografía nuevo'
      />

      <main className='flex-1 p-6 overflow-auto'>
        <Link
          href='/admin/projects'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6'
        >
          <ArrowLeft className='w-4 h-4' />
          Volver a proyectos
        </Link>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <AdminCard title='Detalles del proyecto'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='title'
                      className='text-sm font-medium'
                    >
                      Título del proyecto *
                    </Label>
                    <Input
                      id='title'
                      name='title'
                      required
                      placeholder="ej., Baby Shower en el Jardín de Emma"
                      className='h-12 bg-background border-border/50'
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='category'
                        className='text-sm font-medium'
                      >
                        Categoría *
                      </Label>
                      <select
                        id='category'
                        name='category'
                        required
                        className='w-full h-12 px-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20'
                      >
                        <option value=''>Seleccioná una categoría</option>
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
                        Fecha del evento
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
                      Ubicación
                    </Label>
                    <Input
                      id='location'
                      name='location'
                      placeholder='ej., Jardín Botánico, Centro de la ciudad'
                      className='h-12 bg-background border-border/50'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='short_description'
                      className='text-sm font-medium'
                    >
                      Descripción corta (SEO / tarjetas)
                    </Label>
                    <textarea
                      id='short_description'
                      name='short_description'
                      rows={3}
                      placeholder='Resumen breve que aparece en las tarjetas de proyecto...'
                      className='w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium'
                    >
                      Descripción completa
                    </Label>
                    <textarea
                      id='description'
                      name='description'
                      rows={6}
                      placeholder='Historia completa, detalles y descripción del proyecto...'
                      className='w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none'
                    />
                  </div>
                </div>
              </AdminCard>

              <AdminCard
                title='Imágenes del proyecto'
                description='Subí fotos. Hacé clic en la estrella para establecer la imagen de portada.'
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
                    Arrastrá imágenes acá
                  </p>
                  <p className='text-sm text-foreground-muted mb-4'>
                    o hacé clic para buscar en tu computadora
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Buscar archivos
                  </Button>
                </motion.div>

                {uploadedImages.length > 0 && (
                  <div className='mt-6'>
                    <p className='text-sm text-foreground-muted mb-4'>
                      Hacé clic{' '}
                      <Star className='w-3 h-3 inline text-primary-soft fill-primary-soft' />{' '}
                      para establecer la imagen de portada.
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
                                Error al subir
                              </p>
                            </div>
                          )}
                          {image.status === 'done' && (
                            <>
                              <div className='absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors' />
                              <button
                                type='button'
                                onClick={() => setCoverImageUrl(image.url)}
                                title='Establecer como portada'
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
                                  Portada
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
              <AdminCard title='Publicar'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Estado</Label>
                    <select
                      name='published'
                      className='w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-foreground text-sm'
                    >
                      <option value='draft'>Borrador</option>
                      <option value='published'>Publicado</option>
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
                      Destacado en inicio
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
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      className='flex-1'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Guardar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title='Vista previa'>
                <div className='space-y-3'>
                  <div className='aspect-[4/5] rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden'>
                    {coverImageUrl ? (
                      <Image
                        src={coverImageUrl}
                        alt='Vista previa de portada'
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
                          alt='Vista previa de la primera imagen'
                          fill
                          className='object-cover rounded-lg opacity-50'
                          sizes='200px'
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <p className='text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded'>
                            Sin portada establecida
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center gap-2'>
                        <ImageIcon className='w-8 h-8 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          Sin imagen de portada
                        </p>
                      </div>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {doneCount} imagen{doneCount !== 1 ? 'es' : ''} subida{doneCount !== 1 ? 's' : ''}
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
