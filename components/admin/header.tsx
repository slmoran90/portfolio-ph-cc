"use client"

import { motion } from "framer-motion"

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl border border-border/50 p-6 mb-6"
    >
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-foreground-muted mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
