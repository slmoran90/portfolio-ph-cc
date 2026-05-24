"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section, SectionHeader, Container } from "@/components/layout"

const categories = [
  {
    title: "Baby Shower",
    description: "Celebramos la llegada de nuevas vidas con ternura y elegancia.",
    image: "/images/hero-baby-shower.jpg",
    href: "/projects?category=babyshowers",
  },
  {
    title: "Eventos",
    description: "Capturamos la magia de cada celebración especial.",
    image: "/images/featured-birthday.jpg",
    href: "/projects?category=events",
  },
  {
    title: "Emprendimientos / Empresas",
    description: "Fotografía profesional para marcas, locales y emprendimientos.",
    image: "/images/photographer-portrait.jpg",
    href: "/projects?category=business",
  },
]

export function FeaturedGallery() {
  return (
    <Section className="bg-cream">
      <Container>
        <SectionHeader
          label="Services"
          title="What We Capture"
          description="Every celebration tells a unique story. We specialize in creating timeless imagery that preserves your most cherished moments."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover image-premium transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground mb-2 group-hover:text-warm-gray transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
