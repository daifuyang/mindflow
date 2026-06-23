"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileTree } from "./file-tree"
import { usePathname } from "next/navigation"
import { useMobileSidebar } from "./mobile-sidebar-context"

export function MobileSidebar() {
  const pathname = usePathname()
  const { isOpen, close, tree } = useMobileSidebar()

  useEffect(() => {
    close()
  }, [pathname, close])

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

  if (!isOpen) return null

  return (
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
              <img src="/brand/logo.svg" alt="" className="size-7 rounded-lg" />
              <span className="font-semibold">富阳说</span>
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
            {tree.length > 0 && <FileTree tree={tree} onNavigate={close} />}
          </div>
        </div>
      </aside>
    </div>
  )
}
