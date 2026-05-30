'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ProjectCardProject } from '@/lib/data/project-mappers'

interface ProjectCardProps {
  project: ProjectCardProject
  categoryLabel?: string
  variant?: 'grid' | 'related'
  index?: number
  animateOnMount?: boolean
}

export function ProjectCard({
  project,
  categoryLabel,
  variant = 'grid',
  index = 0,
  animateOnMount = true
}: ProjectCardProps) {
  const isGrid = variant === 'grid'

  const motionProps = animateOnMount
    ? {
        initial: { opacity: 0, y: 40 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.6, delay: index * (isGrid ? 0.1 : 0.15) }
      }
    : {
        initial: { opacity: 0, y: 40 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.6, delay: index * 0.15 },
        viewport: { once: true } as const
      }

  return (
    <motion.div {...motionProps}>
      <Link
        href={`/projects/${project.slug}`}
        className='group block'
      >
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-xl ${isGrid ? 'mb-5' : 'mb-4'}`}
        >
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className='object-cover image-premium transition-transform duration-700 group-hover:scale-105'
            sizes={
              isGrid
                ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                : '(max-width: 768px) 100vw, 33vw'
            }
          />
          {isGrid && (
            <div className='absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          )}
          <div
            className={`absolute bottom-4 right-4 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 ${
              isGrid ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          >
            <ArrowUpRight
              className={
                isGrid ? 'w-5 h-5 text-foreground' : 'w-4 h-4 text-foreground'
              }
            />
          </div>
        </div>
        {isGrid ? (
          <div className='space-y-2'>
            {categoryLabel && (
              <span className='text-xs tracking-[0.3em] uppercase text-primary-soft'>
                {categoryLabel}
              </span>
            )}
            <h3 className='font-serif text-2xl font-medium text-foreground group-hover:text-foreground-muted transition-colors'>
              {project.title}
            </h3>
            <p className='text-sm text-foreground-muted'>
              {project.date} • {project.location}
            </p>
          </div>
        ) : (
          <h3 className='font-serif text-2xl font-medium text-foreground group-hover:text-foreground-muted transition-colors'>
            {project.title}
          </h3>
        )}
      </Link>
    </motion.div>
  )
}
