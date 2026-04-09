"use client"

import { useState, useCallback, useEffect } from "react"
import { Menu, X, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FileTree } from "./file-tree"
import type { TreeNode } from "@/lib/docs"
import { usePathname } from "next/navigation"

export function MobileSidebar({ tree }: { tree: TreeNode[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <button
          onClick={toggle}
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={close}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar pt-14",
              "animate-in duration-200 slide-in-from-left"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full overflow-y-auto">
              <FileTree tree={tree} onNavigate={close} />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
