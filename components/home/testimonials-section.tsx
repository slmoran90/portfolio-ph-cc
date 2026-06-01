"use client"

import { useEffect, useMemo, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { Section, SectionHeader, Container } from "@/components/layout"
import type { Testimonial } from "@/lib/data/testimonials.types"

const SLIDE_DURATION_MS = 5000

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-champagne text-champagne" : "text-border"
          }`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 h-full flex flex-col">
      <div className="w-12 h-12 bg-champagne/30 rounded-full flex items-center justify-center mb-6 shrink-0">
        <Quote className="w-5 h-5 text-primary-soft" />
      </div>

      <StarRating rating={testimonial.rating} />

      <p className="text-foreground leading-relaxed mb-6 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="pt-6 border-t border-border/50 flex items-center gap-3 shrink-0">
        {testimonial.avatar_url ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image
              src={testimonial.avatar_url}
              alt={testimonial.client_name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 shrink-0" aria-hidden="true" />
        )}
        <div>
          <p className="font-medium text-foreground">{testimonial.client_name}</p>
          <p className="text-sm text-foreground-muted min-h-[1.25rem]">
            {testimonial.service?.title}
          </p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsGrid({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          viewport={{ once: true }}
        >
          <TestimonialCard testimonial={testimonial} />
        </motion.div>
      ))}
    </div>
  )
}

function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const pausedRef = useRef(false)

  const slides = useMemo(
    () => [...testimonials, ...testimonials],
    [testimonials]
  )

  useEffect(() => {
    if (shouldReduceMotion) return
    const track = trackRef.current
    if (!track) return

    xRef.current = 0
    let lastTime: number | null = null
    const slideCount = testimonials.length

    function tick(timestamp: number) {
      const delta = lastTime !== null ? timestamp - lastTime : 0
      lastTime = timestamp

      if (!pausedRef.current) {
        const half = track!.scrollWidth / 2
        if (half > 0) {
          const speed = half / (slideCount * SLIDE_DURATION_MS)
          xRef.current -= speed * delta
          if (-xRef.current >= half) xRef.current += half
          track!.style.transform = `translateX(${xRef.current}px)`
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [shouldReduceMotion, testimonials])

  if (shouldReduceMotion) {
    return <TestimonialsGrid testimonials={testimonials} />
  }

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div ref={trackRef} className="flex will-change-transform">
        {slides.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-[0_0_100%] min-w-0 px-3 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null

  return (
    <Section className="bg-secondary/50">
      <Container>
        <SectionHeader
          label="Testimonios"
          title="Lo que dicen quienes confiaron en mí"
          description="La mayor recompensa es ver a las familias disfrutar de los recuerdos que creamos juntos."
        />

        {testimonials.length > 3 ? (
          <TestimonialsCarousel testimonials={testimonials} />
        ) : (
          <TestimonialsGrid testimonials={testimonials} />
        )}
      </Container>
    </Section>
  )
}
