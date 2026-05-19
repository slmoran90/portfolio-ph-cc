"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className={`py-16 lg:py-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  align?: "left" | "center"
}

export function SectionHeader({ label, title, description, align = "center" }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}>
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight text-balance"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-muted-foreground leading-relaxed text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: "default" | "narrow" | "wide"
}

export function Container({ children, className = "", size = "default" }: ContainerProps) {
  const maxWidths = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]"
  }

  return (
    <div className={`${maxWidths[size]} mx-auto px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
