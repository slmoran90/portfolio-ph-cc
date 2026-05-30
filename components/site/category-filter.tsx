"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export interface CategoryOption {
  value: string
  label: string
}

interface CategoryFilterBaseProps {
  options: CategoryOption[]
  activeValue: string
  className?: string
}

interface CategoryFilterLinkProps extends CategoryFilterBaseProps {
  mode: "link"
  getHref: (value: string) => string
}

interface CategoryFilterButtonProps extends CategoryFilterBaseProps {
  mode: "button"
  onChange: (value: string) => void
}

export type CategoryFilterProps = CategoryFilterLinkProps | CategoryFilterButtonProps

function filterButtonClassName(isActive: boolean) {
  return cn(
    "px-6 py-3 rounded-full text-sm tracking-wider transition-all duration-300",
    isActive
      ? "bg-foreground text-background"
      : "bg-secondary text-foreground-muted hover:bg-secondary/80 hover:text-foreground"
  )
}

export function CategoryFilter(props: CategoryFilterProps) {
  const { options, activeValue, className } = props

  return (
    <div
      className={cn("flex flex-wrap justify-center gap-3", className)}
      role="group"
      aria-label="Filter by category"
    >
      {options.map((option) => {
        const isActive = activeValue === option.value

        if (props.mode === "link") {
          return (
            <Link
              key={option.value}
              href={props.getHref(option.value)}
              className={filterButtonClassName(isActive)}
              aria-current={isActive ? "page" : undefined}
            >
              {option.label}
            </Link>
          )
        }

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => props.onChange(option.value)}
            className={filterButtonClassName(isActive)}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
