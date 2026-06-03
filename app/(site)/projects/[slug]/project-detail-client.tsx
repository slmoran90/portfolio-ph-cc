'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Section, Container } from '@/components/layout'
import { ImageLightbox, ProjectCard, ImageWithFallback } from '@/components/site'
import { Masonry } from '@/components/motion/masonry'
import { categories } from '@/lib/data/projects.constants'
import type { Project } from '@/lib/data/projects.types'
import { mapProjectToCardProject } from '@/lib/data/project-mappers'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectDetailClientProps {
  project: Project
  relatedProjects: Project[]
}

export function ProjectDetailClient({
  project,
  relatedProjects
}: ProjectDetailClientProps) {
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const coverImage = project.cover_image
  const categoryLabel = categories.find((c) => c.value === project.category)?.label
  const formattedDate = project.created_at
    ? new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(project.created_at))
    : ''

  const galleryImages = useMemo(
    () => (project.images ?? []).filter((url) => url !== project.cover_image),
    [project.images, project.cover_image]
  )

  const openCover = () => {
    if (coverImage) {
      setLightboxImages([coverImage])
      setLightboxIndex(0)
    }
  }

  const openGallery = (index: number) => {
    setLightboxImages(galleryImages)
    setLightboxIndex(index)
  }

  return (
    <>
      <motion.div>
        {/* Back Button + Hero Section */}
        <Section className='pt-6 md:pt-8'>
          <Container>
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-6 md:mb-8'
            >
              <Link
                href='/projects'
                className='inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground-muted hover:text-foreground hover:bg-secondary/50 transition-colors cursor-pointer'
              >
                <ArrowLeft className='w-4 h-4' />
                Volver a trabajos
              </Link>
            </motion.div>

            {/* Project Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start'>
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {coverImage && (
                  <div
                    className='relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-secondary/30'
                    onClick={openCover}
                  >
                    <ImageWithFallback
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
                  <span className='inline-block text-base tracking-[0.15em] uppercase text-primary font-medium mb-4'>
                    {categoryLabel}
                  </span>
                )}
                <h1 className='font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance'>
                  {project.title}
                </h1>

                <div className='flex flex-wrap gap-6 mb-8'>
                  <div className='flex items-center gap-2 text-foreground-muted'>
                    <Calendar className='w-4 h-4' />
                    <span>{formattedDate}</span>
                  </div>
                  {project.location && (
                    <div className='flex items-center gap-2 text-foreground-muted'>
                      <MapPin className='w-4 h-4' />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                {project.description && (
                  <p className='text-foreground-muted leading-relaxed mb-8 whitespace-pre-line'>
                    {project.description}
                  </p>
                )}

                <Button
                  asChild
                  size='lg'
                  className='text-sm tracking-wider uppercase'
                >
                  <Link href='/contact'>Reservar una sesión similar</Link>
                </Button>
              </motion.div>
            </div>
          </Container>
        </Section>


        {/* Gallery */}
        {galleryImages.length > 0 && (
          <Section>
            <Container>
              <Masonry
                items={galleryImages.map((url, index) => ({
                  id: `${project.id}-gallery-${index}`,
                  content: (
                    <div
                      className='relative overflow-hidden rounded-xl cursor-pointer group bg-secondary/30'
                      onClick={() => openGallery(index)}
                    >
                      <ImageWithFallback
                        src={url}
                        alt={`${project.title} — ${index + 1}`}
                        width={800}
                        height={600}
                        className='w-full h-auto object-cover image-premium transition-transform duration-700 group-hover:scale-105'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                      <div className='absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300' />
                    </div>
                  ),
                }))}
                columns={3}
                gap='1rem'
                itemClassName=''
              />
            </Container>
          </Section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <Section>
            <Container>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className='font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground text-center mb-12'
              >
                Trabajos relacionados
              </motion.h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
                {relatedProjects.map((relatedProject, index) => (
                  <ProjectCard
                    key={relatedProject.id}
                    project={mapProjectToCardProject(relatedProject)}
                    categoryLabel={categories.find((c) => c.value === relatedProject.category)?.label}
                    variant='related'
                    index={index}
                    animateOnMount={false}
                  />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </motion.div>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
        }
        onNext={() =>
          setLightboxIndex((i) =>
            i !== null && i < lightboxImages.length - 1 ? i + 1 : i
          )
        }
        alt={project.title}
      />
    </>
  )
}
