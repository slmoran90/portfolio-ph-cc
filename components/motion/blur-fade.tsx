"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { ReactNode } from "react"

interface BlurFadeProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  blur?: number
  inView?: boolean
}

export function BlurFade({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  y = 16,
  blur = 4,
  inView = true,
}: BlurFadeProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const animationProps = inView
    ? {
        initial: { opacity: 0, y, filter: `blur(${blur}px)` },
        whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
        viewport: { once: true } as const,
      }
    : {
        initial: { opacity: 0, y, filter: `blur(${blur}px)` },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      }

  return (
    <motion.div
      className={className}
      {...animationProps}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
