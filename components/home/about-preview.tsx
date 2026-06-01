"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section, Container } from "@/components/layout"
import { Button } from "@/components/ui/button"

export function AboutPreview() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
              <Image
                src="/images/photographer-portrait.jpg"
                alt="Carla Cáceres - Fotógrafa"
                fill
                className="object-cover image-premium"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-champagne/50 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <div className="relative">
            {/* Decorative grid layer */}
            <div
              className="absolute -top-16 -left-10 -right-10 bottom-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(212, 184, 150, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(212, 184, 150, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
                WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 lg:pl-8"
            >
              <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4">
                Sobre mí
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance">
                Hola, soy Carla
              </h2>
              <div className="space-y-4 text-foreground-muted leading-relaxed mb-8">
                <p>
                  Con más de una década de experiencia en fotografía de eventos, he dedicado mi carrera a capturar las emociones, conexiones y momentos efímeros que hacen que la vida sea hermosa.
                </p>
                <p>
                  Cada baby shower, celebración de cumpleaños y bautismo cuenta una historia única. Mi enfoque combina visión artística con calidez genuina, creando imágenes que atesorarás por generaciones.
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="text-sm tracking-wider uppercase">
                <Link href="/about">
                  Conocé más sobre mí
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
