"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageLightboxProps {
  images: string[]
  currentIndex: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  alt?: string
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  alt = "Imagen de galería",
}: ImageLightboxProps) {
  const onPrevRef = useRef(onPrev)
  const onNextRef = useRef(onNext)
  const onCloseRef = useRef(onClose)
  const touchStartX = useRef(0)

  useEffect(() => { onPrevRef.current = onPrev }, [onPrev])
  useEffect(() => { onNextRef.current = onNext }, [onNext])
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (currentIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrevRef.current()
      else if (e.key === "ArrowRight") onNextRef.current()
      else if (e.key === "Escape") onCloseRef.current()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [currentIndex])

  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [currentIndex])

  if (currentIndex === null || images.length === 0) return null

  const isFirst = currentIndex === 0
  const isLast = currentIndex === images.length - 1
  const currentSrc = images[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) {
          diff > 0 ? onNext() : onPrev()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa de imagen"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors"
        aria-label="Cerrar lightbox"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-background/70 text-sm tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {!isFirst && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {!isLast && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[90vh] p-16 sm:p-20"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentSrc}
              alt={`${alt} ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
