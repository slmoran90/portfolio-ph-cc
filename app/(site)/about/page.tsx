"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Section, Container } from "@/components/layout"
import { Camera, Heart, Award, Users } from "lucide-react"

const stats = [
  { label: "Years Experience", value: "10+", icon: Camera },
  { label: "Happy Families", value: "500+", icon: Heart },
  { label: "Awards Won", value: "15", icon: Award },
  { label: "Events Captured", value: "1,200+", icon: Users },
]

const values = [
  {
    title: "Authentic Moments",
    description: "I believe the most beautiful photographs capture genuine emotions. No forced poses, just real connections and natural expressions.",
  },
  {
    title: "Timeless Artistry",
    description: "Every image I create is designed to stand the test of time. Classic compositions meet modern sensibilities.",
  },
  {
    title: "Personal Connection",
    description: "I take time to understand your family, your story, and what makes your celebration unique.",
  },
  {
    title: "Attention to Detail",
    description: "From the first consultation to the final delivery, every step is handled with care and precision.",
  },
]

export default function AboutPage() {
  return (
    <motion.div className="pt-20">
        {/* Hero Section */}
        <Section className="bg-surface-alt">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4">
                  About Me
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 text-balance">
                  The Story Behind the Lens
                </h1>
                <div className="space-y-4 text-foreground-muted leading-relaxed">
                  <p>
                    Hello, I&apos;m Sofia Martinez, a professional event photographer based in the heart of the city. For over a decade, I&apos;ve had the privilege of documenting life&apos;s most precious celebrations.
                  </p>
                  <p>
                    My journey into photography began with a simple desire: to freeze time and preserve the emotions that make moments meaningful. From the anticipation at a baby shower to the pure joy of a child&apos;s birthday, each event offers a unique story waiting to be told.
                  </p>
                  <p>
                    What sets my work apart is my approach. I don&apos;t just take photos; I create visual narratives that capture the essence of your celebration. My style blends documentary authenticity with artistic elegance, resulting in images that are both natural and refined.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/photographer-portrait.jpg"
                    alt="Sofia Martinez - Professional Photographer"
                    fill
                    className="object-cover image-premium"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-champagne/50 rounded-2xl -z-10" />
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Stats Section */}
        <Section>
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-primary-soft" />
                  </div>
                  <p className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-foreground-muted tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Studio Section */}
        <Section className="bg-secondary/50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/about-studio.jpg"
                    alt="Luminara Photography Studio"
                    fill
                    className="object-cover image-premium"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4">
                  The Studio
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight mb-6 text-balance">
                  A Space Designed for Comfort
                </h2>
                <div className="space-y-4 text-foreground-muted leading-relaxed">
                  <p>
                    Located in a beautifully restored building, my studio offers a warm, inviting atmosphere perfect for intimate portraits and small celebrations.
                  </p>
                  <p>
                    Natural light floods through large windows, creating the soft, elegant illumination that defines my signature style. The space is equipped with everything needed to make your session comfortable and enjoyable.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Values Section */}
        <Section>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4">
                My Philosophy
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight text-balance">
                What Guides My Work
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-8 border border-border/50"
                >
                  <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
    </motion.div>
  )
}
