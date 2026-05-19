"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Section, SectionHeader, Container } from "@/components/layout"

const testimonials = [
  {
    name: "Emily & James Thompson",
    event: "Baby Shower",
    content: "Sofia captured our baby shower so beautifully. Every photo tells a story and brings back all the emotions from that special day. We couldn't be happier with the results.",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    event: "Birthday Party",
    content: "The photos from my daughter's 5th birthday are absolutely magical. Sofia has an incredible talent for capturing the joy and wonder in children's eyes. These memories will last forever.",
    rating: 5,
  },
  {
    name: "The Anderson Family",
    event: "Baptism Ceremony",
    content: "We were blown away by the professionalism and artistry Sofia brought to our son's baptism. The images are timeless, elegant, and full of meaning. Highly recommend!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <Section className="bg-secondary/50">
      <Container>
        <SectionHeader
          label="Testimonials"
          title="Words From Our Families"
          description="The greatest reward is seeing families cherish the memories we create together."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border/50"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-champagne/30 rounded-full flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-dusty-rose" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-champagne text-champagne" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              {/* Author */}
              <div className="pt-6 border-t border-border/50">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
