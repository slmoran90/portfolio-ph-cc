"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"

interface WordFadeTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function WordFadeText({
  text,
  className = "",
  delay = 0.1,
  duration = 0.6,
}: WordFadeTextProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{text}</div>
  }

  const words = text.split(" ")

  return (
    <>
      {/* Visually hidden full text for screen readers */}
      <span className="sr-only">{text}</span>
      {/* Animated words, hidden from screen readers */}
      <motion.div
        className={className}
        aria-hidden="true"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: delay + index * 0.05,
            }}
            className={`inline-block ${index < words.length - 1 ? 'mr-[0.25em]' : ''}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </>
  )
}
