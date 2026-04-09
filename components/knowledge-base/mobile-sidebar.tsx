"use client"

import { useState, useCallback, useEffect } from "react"
import { Menu, X } from "lucide-react"
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
        className="fixed top-3 left-4 z-50 inline-flex size-10 items-center justify-center rounded-md border border-border bg-background/95 shadow-sm backdrop-blur hover:bg-accent md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={close}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar",
              "animate-in duration-200 slide-in-from-left"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b border-border px-4">
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
