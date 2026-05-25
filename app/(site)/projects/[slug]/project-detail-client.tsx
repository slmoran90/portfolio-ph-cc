'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Section, Container } from '@/components/layout'
import { ImageLightbox } from '@/components/site'
import { categories } from '@/lib/data/projects.constants'
import type { Project } from '@/lib/data/projects.types'
import { ArrowLeft, ArrowUpRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectDetailClientProps {
  project: Project
  relatedProjects: Project[]
}

export function ProjectDetailClient({
  project,
  relatedProjects
}: ProjectDetailClientProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const coverImage = project.cover_image
  const categoryLabel = categories.find((c) => c.value === project.category)?.label
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(project.created_at))

  return (
    <>
      <motion.div className='pt-20'>
        {/* Back Button */}
        <Section className='pb-0'>
          <Container>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href='/projects'
                className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to Projects
              </Link>
            </motion.div>
          </Container>
        </Section>

        {/* Hero Section */}
        <Section className='pt-8'>
          <Container>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start'>
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {coverImage && (
                  <div
                    className='relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer'
                    onClick={() => setLightboxImage(coverImage)}
                  >
                    <Image
                      src={coverImage}
                      alt={project.title}
                      fill
                      className='object-cover image-premium hover:scale-105 transition-transform duration-700'
                      priority
                      sizes='(max-width: 1024px) 100vw, 50vw'
                    />
                  </div>
                )}
              </motion.div>

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='lg:sticky lg:top-32'
              >
                {categoryLabel && (
                  <span className='inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4'>
                    {categoryLabel}
                  </span>
                )}
                <h1 className='font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance'>
                  {project.title}
                </h1>

                <div className='flex flex-wrap gap-6 mb-8'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Calendar className='w-4 h-4' />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {project.short_description && (
                  <p className='text-muted-foreground leading-relaxed mb-8'>
                    {project.short_description}
                  </p>
                )}

                <Button
                  asChild
                  size='lg'
                  className='text-sm tracking-wider uppercase'
                >
                  <Link href='/contact'>Book a Similar Session</Link>
                </Button>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <Section>
            <Container>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className='font-serif text-2xl md:text-3xl font-medium text-foreground text-center mb-12'
              >
                Related Projects
              </motion.h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/projects/${relatedProject.slug}`}
                      className='group block'
                    >
                      <div className='relative aspect-[4/5] overflow-hidden rounded-xl mb-4'>
                        <Image
                          src={relatedProject.cover_image || '/placeholder.jpg'}
                          alt={relatedProject.title}
                          fill
                          className='object-cover image-premium transition-transform duration-700 group-hover:scale-105'
                          sizes='(max-width: 768px) 100vw, 33vw'
                        />
                        <div className='absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0'>
                          <ArrowUpRight className='w-4 h-4 text-foreground' />
                        </div>
                      </div>
                      <h3 className='font-serif text-lg font-medium text-foreground group-hover:text-warm-gray transition-colors'>
                        {relatedProject.title}
                      </h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Container>
          </Section>
        )}
      </motion.div>

      <ImageLightbox
        imageSrc={lightboxImage}
        onClose={() => setLightboxImage(null)}
        alt={project.title}
      />
    </>
  )
}
