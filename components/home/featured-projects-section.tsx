'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, Container } from '@/components/layout'
import { ProjectCard } from '@/components/site'
import { Button } from '@/components/ui/button'
import { mapProjectToCardProject } from '@/lib/data/project-mappers'
import type { Project } from '@/lib/data/projects.types'
import { categories } from '@/lib/data/projects.constants'

interface FeaturedProjectsSectionProps {
  projects: Project[]
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) return null

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-12'
        >
          <span className='inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4'>
            Trabajos
          </span>
          <h2 className='font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance'>
            Trabajos destacados
          </h2>
          <p className='text-foreground-muted leading-relaxed max-w-xl mx-auto'>
            Una selección curada de mis trabajos más significativos.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={mapProjectToCardProject(project)}
              categoryLabel={categories.find((c) => c.value === project.category)?.label}
              variant='grid'
              index={index}
              animateOnMount={false}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className='text-center mt-12'
        >
          <Button asChild variant='outline' size='lg' className='text-sm tracking-wider uppercase'>
            <Link href='/projects'>
              Ver todos los trabajos
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </Section>
  )
}
