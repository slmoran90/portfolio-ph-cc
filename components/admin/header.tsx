"use client"

import { motion } from "framer-motion"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="pl-4 lg:pl-0">
          <h1 className="font-serif text-2xl font-medium text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-foreground-muted mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-10 w-64 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-foreground-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-admin-accent rounded-full" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
