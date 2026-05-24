'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { Section, Container } from '@/components/layout'
import { ImageLightbox, ProjectCard } from '@/components/site'
import {
  getProjectById,
  getRelatedProjects,
  categories
} from '@/lib/projects-data.mock'
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function SingleProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const project = getProjectById(projectId)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (!project) {
    notFound()
  }

  const relatedProjects = getRelatedProjects(project.id, project.category)

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
                <div
                  className='relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer'
                  onClick={() => setLightboxImage(project.coverImage)}
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className='object-cover image-premium hover:scale-105 transition-transform duration-700'
                    priority
                    sizes='(max-width: 1024px) 100vw, 50vw'
                  />
                </div>
              </motion.div>

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='lg:sticky lg:top-32'
              >
                <span className='inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4'>
                  {categories.find((c) => c.value === project.category)?.label}
                </span>
                <h1 className='font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance'>
                  {project.title}
                </h1>

                <div className='flex flex-wrap gap-6 mb-8'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Calendar className='w-4 h-4' />
                    <span>{project.date}</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <MapPin className='w-4 h-4' />
                    <span>{project.location}</span>
                  </div>
                </div>

                <p className='text-muted-foreground leading-relaxed mb-8'>
                  {project.description}
                </p>

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

        {/* Gallery Section */}
        <Section className='bg-cream'>
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='font-serif text-2xl md:text-3xl font-medium text-foreground text-center mb-12'
            >
              Gallery
            </motion.h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group'
                  onClick={() => setLightboxImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className='object-cover image-premium transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  <div className='absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </motion.div>
              ))}
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
                      href={`/projects/${relatedProject.id}`}
                      className='group block'
                    >
                      <div className='relative aspect-[4/5] overflow-hidden rounded-xl mb-4'>
                        <Image
                          src={relatedProject.coverImage}
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

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4'
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className='absolute top-6 right-6 text-background hover:text-background/80 transition-colors'
            aria-label='Close lightbox'
          >
            <svg
              className='w-8 h-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
          <div className='relative max-w-5xl max-h-[90vh] w-full h-full'>
            <Image
              src={lightboxImage}
              alt='Gallery image'
              fill
              className='object-contain'
              sizes='90vw'
            />
          </div>
        </motion.div>
      )}
    </>
  )
}
