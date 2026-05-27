"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Section, Container } from "@/components/layout"
import { PageHero, CategoryFilter, ImageLightbox } from "@/components/site"
import { useState } from "react"
import { categories as filters } from "@/lib/data/projects.constants"

const galleryImages = [
  { src: "/images/hero-baby-shower.jpg", category: "babyshowers" },
  { src: "/images/featured-birthday.jpg", category: "events" },
  { src: "/images/featured-baptism.jpg", category: "events" },
  { src: "/images/gallery/gallery-1.jpg", category: "babyshowers" },
  { src: "/images/gallery/gallery-2.jpg", category: "events" },
  { src: "/images/gallery/gallery-3.jpg", category: "events" },
  { src: "/images/gallery/gallery-4.jpg", category: "babyshowers" },
  { src: "/images/gallery/gallery-5.jpg", category: "events" },
  { src: "/images/gallery/gallery-6.jpg", category: "events" },
  { src: "/images/photographer-portrait.jpg", category: "business" },
  { src: "/images/about-studio.jpg", category: "business" },
]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages =
    activeFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter)

  const lightboxImageUrls = filteredImages.map((i) => i.src)

  return (
    <>
      <motion.div className="pt-20">
        <PageHero
          label="Gallery"
          title="A Visual Journey"
          description="Browse through our collection of captured moments. Each image tells a story of love, joy, and celebration."
        />

        <Section>
          <Container size="wide">
            <CategoryFilter
              mode="button"
              options={filters}
              activeValue={activeFilter}
              onChange={setActiveFilter}
              className="mb-12"
            />

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <div
                    className="relative overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={image.src}
                      alt={`Gallery image - ${image.category}`}
                      width={600}
                      height={index % 3 === 0 ? 800 : index % 3 === 1 ? 600 : 700}
                      className="w-full h-auto object-cover image-premium transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
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
        alt="Gallery image"
      />
    </>
  )
}
