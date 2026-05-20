"use client"

import { motion } from "framer-motion"
import { Section, Container } from "@/components/layout"

interface PageHeroProps {
  label: string
  title: string
  description: string
  containerSize?: "default" | "narrow" | "wide"
  descriptionClassName?: string
}

export function PageHero({
  label,
  title,
  description,
  containerSize = "default",
  descriptionClassName = "",
}: PageHeroProps) {
  return (
    <Section className="bg-cream">
      <Container size={containerSize}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4">
            {label}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 text-balance">
            {title}
          </h1>
          <p
            className={`text-lg text-muted-foreground leading-relaxed ${descriptionClassName}`}
          >
            {description}
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
