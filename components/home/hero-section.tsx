"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WordFadeText } from "@/components/motion/word-fade-text"

export function HeroSection() {
  const { scrollY } = useScroll()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setShouldReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Parallax for background image (disabled on mobile and with reduced motion)
  const y = useTransform(scrollY, [0, 500], [0, shouldReduceMotion || isMobile ? 0 : 40], {
    clamp: true
  })

  // Gradient overlay opacity enhancement
  const gradientOpacity = useTransform(scrollY, [0, 300], [0.3, 0.5], {
    clamp: true
  })

  // Scroll indicator fade out
  const indicatorOpacity = useTransform(scrollY, [0, 300], [1, 0], {
    clamp: true
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ 
            y: shouldReduceMotion || isMobile ? 0 : y,
            height: '120%',
            top: '-10%'
          }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-baby-shower.jpg"
            alt="Hermosa fotografía de baby shower"
            fill
            className="object-cover image-premium"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/20"
          style={{ opacity: gradientOpacity }}
        />
      </div>

      {/* Permanent Warm Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/70 to-background/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="block text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-6"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
          >
            Fotografía profesional
          </motion.span>
          
          <WordFadeText
            text="Capturando los momentos más preciosos de la vida"
            className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium text-foreground leading-[1.1] mb-8 text-balance"
            delay={0.1}
            duration={0.8}
          />
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground-muted leading-relaxed mb-10 max-w-xl"
          >
            Especializada en baby showers, cumpleaños y bautismos. Creando recuerdos atemporales con elegancia y arte.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="text-sm tracking-wider uppercase px-8">
              <Link href="/projects">
                Ver proyectos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-sm tracking-wider uppercase px-8">
              <Link href="/contact">
                Reservar sesión
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ opacity: indicatorOpacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-foreground/50 rounded-full" 
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
