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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/photographer-portrait.jpg"
                alt="Sofia Martinez - Photographer"
                fill
                className="object-cover image-premium"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-champagne/50 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4">
              The Artist
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance">
              Hello, I&apos;m Sofia
            </h2>
            <div className="space-y-4 text-foreground-muted leading-relaxed mb-8">
              <p>
                With over a decade of experience in event photography, I&apos;ve dedicated my career to capturing the emotions, connections, and fleeting moments that make life beautiful.
              </p>
              <p>
                Every baby shower, birthday celebration, and baptism tells a unique story. My approach combines artistic vision with genuine warmth, creating images that you&apos;ll treasure for generations.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="text-sm tracking-wider uppercase">
              <Link href="/about">
                Learn More About Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
