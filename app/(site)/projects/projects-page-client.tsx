'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

import { Section, Container } from '@/components/layout'
import { PageHero, CategoryFilter, ProjectCard } from '@/components/site'

import { categories } from '@/lib/data/projects.constants'
import type { Project } from '@/lib/data/projects.types'
import { mapProjectToCardProject } from '@/lib/data/project-mappers'

interface ProjectsContentProps {
  projects: Project[]
}

function ProjectsContent({ projects }: ProjectsContentProps) {
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('category') || 'all'

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <>
      <CategoryFilter
        mode='link'
        options={categories}
        activeValue={activeCategory}
        className='mb-12 lg:mb-16'
        getHref={(value) =>
          value === 'all' ? '/projects' : `/projects?category=${value}`
        }
      />

      {filteredProjects.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-foreground-muted text-lg mb-6'>
            No se encontraron trabajos en esta categoría.
          </p>
          <a
            href='/projects'
            className='inline-flex items-center gap-2 text-foreground hover:text-foreground-muted transition-colors'
          >
            Ver todos los trabajos
          </a>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={mapProjectToCardProject(project)}
              categoryLabel={
                categories.find((c) => c.value === project.category)?.label
              }
              index={index}
            />
          ))}
        </div>
      )}
    </>
  )
}

interface ProjectsPageClientProps {
  projects: Project[]
}

export default function ProjectsPageClient({
  projects
}: ProjectsPageClientProps) {
  return (
    <motion.div className='pt-20'>
      <PageHero
        label='Trabajos'
        title='Trabajos destacados'
        description='Explora una colección curada de celebraciones, cada una única y llena de emoción. Cada trabajo cuenta una historia que vale la pena recordar.'
      />

      <Section>
        <Container>
          <Suspense
            fallback={
              <div className='text-center text-foreground-muted'>
                Cargando trabajos...
              </div>
            }
          >
            <ProjectsContent projects={projects} />
          </Suspense>
        </Container>
      </Section>
    </motion.div>
  )
}
