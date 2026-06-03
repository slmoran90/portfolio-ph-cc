'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import { PageHero, CategoryFilter, ImageLightbox, ImageWithFallback } from '@/components/site'
import { Masonry } from '@/components/motion/masonry'
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
          label='Galería'
          title='Un viaje visual'
          description='Explora nuestra colección de momentos capturados. Cada imagen cuenta una historia de amor, alegría y celebración.'
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
                className='text-center text-foreground-muted py-16'
              >
                Todavía no hay imágenes en esta categoría.
              </motion.p>
            ) : (
              <Masonry
                items={filteredImages.map((image, index) => ({
                  id: image.id,
                  content: (
                    <div
                      className='relative overflow-hidden rounded-xl cursor-pointer group bg-secondary/30'
                      onClick={() => setLightboxIndex(index)}
                    >
                      <ImageWithFallback
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
                  ),
                }))}
                columns={3}
                gap='1.5rem'
                itemClassName=''
              />
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
        alt='Imagen de galería'
      />
    </>
  )
}
