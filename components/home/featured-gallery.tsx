"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Section, SectionHeader, Container } from "@/components/layout"
import type { Service } from "@/lib/data/services.types"

export function FeaturedGallery({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <Section className="bg-surface-alt">
      <Container>
        <SectionHeader
          label="Services"
          title="What We Capture"
          description="Every celebration tells a unique story. We specialize in creating timeless imagery that preserves your most cherished moments."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-secondary/30">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      priority={index === 0}
                      className="object-cover image-premium transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground mb-2 group-hover:text-foreground-muted transition-colors">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
