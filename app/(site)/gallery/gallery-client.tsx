'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import { PageHero, CategoryFilter, ImageLightbox } from '@/components/site'
import { categories } from '@/lib/data/projects.constants'
import type { GalleryImage } from '@/lib/data/gallery.types'

export default function GalleryClient({
  images
}: {
  images: GalleryImage[]
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = useMemo(
    () =>
      activeFilter === 'all'
        ? images
        : images.filter((img) => img.category === activeFilter),
    [images, activeFilter]
  )

  const lightboxImageUrls = useMemo(
    () => filteredImages.map((i) => i.image_url),
    [filteredImages]
  )

  return (
    <>
      <motion.div className='pt-20'>
        <PageHero
          label='Gallery'
          title='A Visual Journey'
          description='Browse through our collection of captured moments. Each image tells a story of love, joy, and celebration.'
        />

        <Section>
          <Container size='wide'>
            <CategoryFilter
              mode='button'
              options={categories}
              activeValue={activeFilter}
              onChange={setActiveFilter}
              className='mb-12'
            />

            {filteredImages.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center text-muted-foreground py-16'
              >
                No images in this category yet.
              </motion.p>
            ) : (
              <div className='columns-1 md:columns-2 lg:columns-3 gap-6'>
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                    className='break-inside-avoid mb-6'
                  >
                    <div
                      className='relative overflow-hidden rounded-xl cursor-pointer group bg-secondary/30'
                      onClick={() => setLightboxIndex(index)}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.title ?? 'Gallery image'}
                        width={600}
                        height={600}
                        priority={index === 0}
                        className='w-full h-auto object-cover image-premium transition-transform duration-700 group-hover:scale-105'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                      <div className='absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300' />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </motion.div>

      <ImageLightbox
        images={lightboxImageUrls}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
        onNext={() =>
          setLightboxIndex((i) =>
            i !== null && i < lightboxImageUrls.length - 1 ? i + 1 : i
          )
        }
        alt='Gallery image'
      />
    </>
  )
}
