'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AdminHeader, StatCard, AdminCard } from '@/components/admin'
import { Button } from '@/components/ui/button'
import {
  FolderOpen,
  Image as ImageIcon,
  ArrowRight,
  Star
} from 'lucide-react'
import type { Project } from '@/lib/data/projects.types'
import type { GalleryImage } from '@/lib/data/gallery.types'
import type { SiteSettings } from '@/lib/data/site-settings.types'

export default function DashboardClient({
  projects,
  galleryCount,
  recentGallery,
  siteSettings
}: {
  projects: Project[]
  galleryCount: number
  recentGallery: GalleryImage[]
  siteSettings: SiteSettings | null
}) {
  const publishedCount = projects.filter((p) => p.published).length

  const firstName = siteSettings?.full_name?.split(/\s+/)[0] || null
  const greeting = firstName
    ? `Hola, ${firstName}. Esto es lo que está pasando.`
    : "Hola. Esto es lo que está pasando."

  return (
    <>
      <AdminHeader
        title='Panel'
        description={greeting}
      />

      <main className='flex-1 p-6 overflow-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
          <StatCard
            title='Total de proyectos'
            value={projects.length}
            change={`${publishedCount} publicados`}
            changeType='positive'
            icon={FolderOpen}
          />
          <StatCard
            title='Proyectos publicados'
            value={publishedCount}
            change={`${projects.length - publishedCount} borradores`}
            changeType='neutral'
            icon={FolderOpen}
          />
          <StatCard
            title='Imágenes en galería'
            value={galleryCount}
            icon={ImageIcon}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Projects */}
          <AdminCard
            title='Proyectos recientes'
            description='Tus últimos proyectos de fotografía'
            action={
              <Button asChild variant='outline' size='sm'>
                <Link href='/admin/projects'>
                  Ver todos
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Link>
              </Button>
            }
          >
            <div className='space-y-4'>
              {projects.slice(0, 4).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors'
                >
                  <div className='relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-secondary'>
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        className='object-cover'
                        sizes='56px'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <ImageIcon className='w-4 h-4 text-muted-foreground' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-foreground truncate'>
                      {project.title}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {project.created_at
                        ? new Intl.DateTimeFormat('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            timeZone: 'UTC'
                          }).format(new Date(project.created_at))
                        : '—'}
                    </p>
                  </div>
                  <Button asChild variant='ghost' size='sm'>
                    <Link href={`/admin/projects/${project.id}`}>Editar</Link>
                  </Button>
                </motion.div>
              ))}
              {projects.length === 0 && (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  Aún no hay proyectos.
                </p>
              )}
            </div>
          </AdminCard>

          {/* Recent Gallery Uploads */}
          <AdminCard
            title='Subidas recientes'
            description='Últimas imágenes agregadas a la galería'
            action={
              <Button asChild variant='outline' size='sm'>
                <Link href='/admin/gallery'>
                  Ver todos
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Link>
              </Button>
            }
          >
            <div className='space-y-4'>
              {recentGallery.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors'
                >
                  <div className='relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-secondary'>
                    <Image
                      src={image.image_url}
                      alt={image.title ?? 'Imagen de galería'}
                      fill
                      className='object-cover'
                      sizes='56px'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <p className='font-medium text-foreground truncate'>
                        {image.title ?? 'Sin título'}
                      </p>
                      {image.featured && (
                        <Star className='w-3 h-3 text-amber-400 fill-amber-400 shrink-0' />
                      )}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {new Intl.DateTimeFormat('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC'
                      }).format(new Date(image.created_at))}
                    </p>
                  </div>
                </motion.div>
              ))}
              {recentGallery.length === 0 && (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  Aún no hay imágenes en la galería.
                </p>
              )}
            </div>
          </AdminCard>
        </div>
      </main>
    </>
  )
}
