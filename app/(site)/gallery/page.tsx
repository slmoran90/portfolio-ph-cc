"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Section, Container } from "@/components/layout"
import { useState } from "react"

const galleryImages = [
  { src: "/images/hero-baby-shower.jpg", category: "baby-shower" },
  { src: "/images/featured-birthday.jpg", category: "birthday" },
  { src: "/images/featured-baptism.jpg", category: "baptism" },
  { src: "/images/gallery/gallery-1.jpg", category: "baby-shower" },
  { src: "/images/gallery/gallery-2.jpg", category: "birthday" },
  { src: "/images/gallery/gallery-3.jpg", category: "baptism" },
  { src: "/images/gallery/gallery-4.jpg", category: "baby-shower" },
  { src: "/images/gallery/gallery-5.jpg", category: "birthday" },
  { src: "/images/gallery/gallery-6.jpg", category: "baptism" },
  { src: "/images/photographer-portrait.jpg", category: "portrait" },
  { src: "/images/about-studio.jpg", category: "studio" },
]

const filters = [
  { value: "all", label: "All" },
  { value: "baby-shower", label: "Baby Showers" },
  { value: "birthday", label: "Birthdays" },
  { value: "baptism", label: "Baptisms" },
]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const filteredImages =
    activeFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter)

  return (
    <>
    <motion.div className="pt-20">
        {/* Hero Section */}
        <Section className="bg-cream">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4">
                Gallery
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 text-balance">
                A Visual Journey
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Browse through our collection of captured moments. Each image tells a story of love, joy, and celebration.
              </p>
            </motion.div>
          </Container>
        </Section>

        {/* Gallery Section */}
        <Section>
          <Container size="wide">
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-6 py-3 rounded-full text-sm tracking-wider transition-all duration-300 ${
                    activeFilter === filter.value
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Masonry Grid */}
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
                    onClick={() => setLightboxImage(image.src)}
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

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-background hover:text-background/80 transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </motion.div>
      )}
    </>
  )
}
