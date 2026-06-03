"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { ReactNode } from "react"

interface MasonryItem {
  id: string
  content: ReactNode
  aspectRatio?: number
}

interface MasonryProps {
  items: MasonryItem[]
  columns?: number
  gap?: string
  className?: string
  itemClassName?: string
}

export function Masonry({
  items,
  columns = 3,
  gap = "1.5rem",
  className = "",
  itemClassName = "",
}: MasonryProps) {
  const reducedMotion = useReducedMotion()
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [columnItems, setColumnItems] = useState<MasonryItem[][]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive columns
  const getResponsiveColumns = () => {
    if (typeof window === "undefined") return columns
    const width = window.innerWidth
    if (width < 768) return 1
    if (width < 1024) return 2
    return columns
  }

  // Distribute items across columns to balance heights
  useEffect(() => {
    if (reducedMotion) {
      // For reduced motion, just distribute evenly
      const colCount = getResponsiveColumns()
      const cols: MasonryItem[][] = Array.from({ length: colCount }, () => [])
      items.forEach((item, index) => {
        cols[index % colCount].push(item)
      })
      setColumnItems(cols)
      return
    }

    const colCount = getResponsiveColumns()
    const cols: MasonryItem[][] = Array.from({ length: colCount }, () => [])
    const heights: number[] = Array(colCount).fill(0)

    items.forEach((item) => {
      // Find column with minimum height
      const minHeightIndex = heights.indexOf(Math.min(...heights))
      cols[minHeightIndex].push(item)
      // Add item height (use aspect ratio as proxy, default to 1)
      const itemHeight = (item.aspectRatio || 1) * 100
      heights[minHeightIndex] += itemHeight
    })

    setColumnItems(cols)
    setColumnHeights(heights)
  }, [items, reducedMotion])

  return (
    <div
      ref={containerRef}
      className={`grid gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${getResponsiveColumns()}, 1fr)`,
        gap,
      }}
    >
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {column.map((item, itemIndex) => (
            <motion.div
              key={item.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : (colIndex * 0.05) + (itemIndex * 0.05),
              }}
              className={itemClassName}
            >
              {item.content}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}
