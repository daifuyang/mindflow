"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex flex-wrap gap-x-2 gap-y-1 text-sm", className)}
    >
      <Link
        href="/docs"
        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="inline-flex items-center gap-1.5">
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="break-words text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium break-words text-foreground">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
