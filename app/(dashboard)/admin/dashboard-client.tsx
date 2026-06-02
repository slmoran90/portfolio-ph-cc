'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AdminCard } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FolderOpen,
  Image as ImageIcon,
  ArrowRight,
  Star
} from 'lucide-react'
import { ImageWithFallback } from '@/components/site'
import type { Project } from '@/lib/data/projects.types'
import type { GalleryImage } from '@/lib/data/gallery.types'
import type { SiteSettings } from '@/lib/data/site-settings.types'

interface DashboardStatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: any
}

function DashboardStatCard({ title, value, change, changeType = 'neutral', icon: Icon }: DashboardStatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-500',
    neutral: 'text-foreground-muted',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="border-border/50 h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground-muted">
            {title}
          </CardTitle>
          <div className="w-10 h-10 bg-surface-alt rounded-md flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-soft" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="text-2xl font-serif font-medium text-foreground">
            {value}
          </div>
          <p className={`text-xs ${changeColors[changeType]} mt-1 min-h-5`}>
            {change || '\u00A0'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

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
      <main className='flex-1 p-6 overflow-auto'>
        {/* Welcome Card */}
        <div className='bg-card rounded-2xl border border-border/50 p-6 mb-6'>
          <h1 className='font-serif text-2xl font-medium text-foreground'>
            Panel
          </h1>
          <p className='text-sm text-foreground-muted mt-1'>{greeting}</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6'>
          <DashboardStatCard
            title='Total de proyectos'
            value={projects.length}
            change={`${publishedCount} publicados`}
            changeType='positive'
            icon={FolderOpen}
          />
          <DashboardStatCard
            title='Proyectos publicados'
            value={publishedCount}
            change={`${projects.length - publishedCount} borradores`}
            changeType='neutral'
            icon={FolderOpen}
          />
          <DashboardStatCard
            title='Imágenes en galería'
            value={galleryCount}
            icon={ImageIcon}
          />
        </div>

        {/* Recent Sections */}
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
                    <ImageWithFallback
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
