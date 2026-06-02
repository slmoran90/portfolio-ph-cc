'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  onClick?: () => void
  fallbackClassName?: string
}

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  loading = 'lazy',
  onClick,
  fallbackClassName,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Reset error state when src changes
  if (src !== imageSrc && src) {
    setImageSrc(src)
    setHasError(false)
  }

  // Handle null/empty src
  if (!imageSrc || imageSrc === '') {
    return (
      <div
        className={cn(
          'bg-secondary/50 flex items-center justify-center text-muted-foreground',
          className
        )}
      >
        <ImageOff className="w-8 h-8" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-secondary/50 flex items-center justify-center text-muted-foreground',
          className,
          fallbackClassName
        )}
      >
        <ImageOff className="w-8 h-8" />
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading}
        onClick={onClick}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading}
      onClick={onClick}
      onError={() => setHasError(true)}
    />
  )
}
