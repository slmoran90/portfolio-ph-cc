"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-500",
    neutral: "text-foreground-muted",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground-muted">
            {title}
          </CardTitle>
          <div className="w-10 h-10 bg-surface-alt rounded-md flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-soft" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif font-medium text-foreground">
            {value}
          </div>
          {change && (
            <p className={`text-xs ${changeColors[changeType]} mt-1`}>
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AdminCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
}

export function AdminCard({ title, description, children, action }: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg font-serif font-medium text-foreground">
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-foreground-muted mt-1">{description}</p>
            )}
          </div>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-soft" />
      </div>
      <h3 className="font-serif text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-foreground-muted max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
