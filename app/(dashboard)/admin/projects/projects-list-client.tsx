'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AdminHeader, AdminCard, EmptyState } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { categories } from '@/lib/data/projects.constants'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Star
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProject } from '@/lib/actions/projects'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
import type { Project } from '@/lib/data/projects.types'

export default function ProjectsListClient({
  projects
}: {
  projects: Project[]
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function openDeleteDialog(project: Project) {
    setPendingDelete(project)
    setDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteProject(
        pendingDelete.id,
        pendingDelete.slug,
        pendingDelete.images ?? []
      )
      if (result.error) {
        console.error('Delete error:', result.error)
      } else {
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
        title='Proyectos'
        description='Administrá tus proyectos de fotografía'
      />

      <main className='flex-1 p-6 overflow-auto'>
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Buscar proyectos...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-background border-border/50'
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='h-10 px-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft'
          >
            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>
          <Button asChild>
            <Link href='/admin/projects/new'>
              <Plus className='w-4 h-4 mr-2' />
              Nuevo proyecto
            </Link>
          </Button>
        </div>

        <AdminCard title={`Proyectos creados: ${filteredProjects.length}`}>
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title='No se encontraron proyectos'
              description='Probá ajustar tu búsqueda o filtro, o creá un proyecto nuevo.'
              action={
                <Button asChild>
                  <Link href='/admin/projects/new'>
                    <Plus className='w-4 h-4 mr-2' />
                    Crear proyecto
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className='space-y-2'>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors'
                >
                  <div className='relative w-16 h-16 rounded-lg overflow-hidden shrink-0'>
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    ) : (
                      <div className='w-full h-full bg-secondary flex items-center justify-center'>
                        <ImageIcon className='w-5 h-5 text-muted-foreground' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-foreground truncate'>
                      {project.title}
                    </h3>
                    <div className='flex flex-wrap items-center gap-2 mt-1.5'>
                      <span className='text-xs px-2 py-1 rounded-full bg-champagne/30 text-foreground'>
                        {
                          categories.find((c) => c.value === project.category)
                            ?.label ?? project.category
                        }
                      </span>
                      <span className='text-xs px-2 py-1 rounded-full bg-surface-alt text-foreground-muted'>
                        {project.created_at
                          ? new Intl.DateTimeFormat('es-AR', {
                              year: 'numeric',
                              month: 'short',
                              timeZone: 'UTC'
                            }).format(new Date(project.created_at))
                          : '—'}
                      </span>
                      <span className='text-xs px-2 py-1 rounded-full bg-surface-alt text-foreground-muted'>
                        {project.images?.length ?? 0} imágenes
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          project.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-secondary text-foreground-muted'
                        }`}
                      >
                        {project.published ? 'Publicado' : 'Borrador'}
                      </span>
                      {project.featured && (
                        <span className='text-xs px-2 py-0.5 rounded-full bg-champagne/40 text-foreground flex items-center gap-1'>
                          <Star className='w-3 h-3 fill-current' />
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-1.5 shrink-0'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size='sm' variant='outline' asChild>
                          <Link
                            href={`/projects/${project.slug}`}
                            target='_blank'
                          >
                            <Eye className='w-3.5 h-3.5' />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver en vivo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size='sm' variant='outline' asChild>
                          <Link href={`/admin/projects/${project.id}`}>
                            <Pencil className='w-3.5 h-3.5' />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-destructive border-destructive/30 hover:bg-destructive/10'
                          onClick={() => openDeleteDialog(project)}
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar</TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </main>

      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title='¿Eliminar proyecto?'
        description={`¿Eliminar "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </>
  )}
