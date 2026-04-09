"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Menu, X, BookOpen } from "lucide-react"
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
      <button
        onClick={toggle}
        className="fixed top-3 left-4 z-50 inline-flex size-10 items-center justify-center rounded-lg border border-border/50 bg-background/95 shadow-sm backdrop-blur transition-all hover:bg-accent hover:shadow-md md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={close}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 w-80 max-w-[85vw] border-r border-border bg-sidebar",
              "animate-in duration-200 slide-in-from-left"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="size-4 text-primary" />
                  </div>
                  <span className="font-semibold">MindFlow</span>
                </Link>
                <button
                  onClick={close}
                  className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FileTree tree={tree} onNavigate={close} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
