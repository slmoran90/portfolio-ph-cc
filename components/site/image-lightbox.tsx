"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface ImageLightboxProps {
  imageSrc: string | null
  onClose: () => void
  alt?: string
}

export function ImageLightbox({
  imageSrc,
  onClose,
  alt = "Gallery image",
}: ImageLightboxProps) {
  if (!imageSrc) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-background hover:text-background/80 transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>
    </motion.div>
  )
}
