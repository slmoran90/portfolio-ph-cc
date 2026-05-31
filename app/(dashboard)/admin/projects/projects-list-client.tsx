'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AdminHeader, AdminCard, EmptyState } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories } from '@/lib/data/projects.constants'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Star
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import type { Project } from '@/lib/data/projects.types'

export default function ProjectsListClient({
  projects
}: {
  projects: Project[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <AdminHeader
        title='Projects'
        description='Manage your photography projects and portfolios'
      />

      <main className='flex-1 p-6 overflow-auto'>
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search projects...'
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
              New Project
            </Link>
          </Button>
        </div>

        <AdminCard title={`${filteredProjects.length} Projects`}>
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title='No projects found'
              description='Try adjusting your search or filter, or create a new project.'
              action={
                <Button asChild>
                  <Link href='/admin/projects/new'>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Project
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
                    <div className='flex items-center gap-4 mt-1'>
                      <span className='text-xs px-2 py-1 rounded-full bg-champagne/30 text-foreground'>
                        {
                          categories.find((c) => c.value === project.category)
                            ?.label ?? project.category
                        }
                      </span>
                      <span className='text-sm text-foreground-muted'>
                        {project.created_at
                          ? new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: 'long',
                              timeZone: 'UTC'
                            }).format(new Date(project.created_at))
                          : '—'}
                      </span>
                      <span className='text-sm text-foreground-muted'>
                        {project.images?.length ?? 0} images
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          project.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-secondary text-foreground-muted'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                      {project.featured && (
                        <span className='text-xs px-2 py-0.5 rounded-full bg-champagne/40 text-foreground flex items-center gap-1'>
                          <Star className='w-3 h-3 fill-current' />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                      >
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/projects/${project.slug}`}
                          target='_blank'
                        >
                          <Eye className='w-4 h-4 mr-2' />
                          View Live
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit className='w-4 h-4 mr-2' />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-destructive'>
                        <Trash2 className='w-4 h-4 mr-2' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </main>
    </>
  )
}
