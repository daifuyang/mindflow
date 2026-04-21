"use client"

import { usePathname } from "next/navigation"
import { useDocSidebar } from "./doc-sidebar-context"

export function SidebarMenuButton() {
  const pathname = usePathname()
  const { toggle } = useDocSidebar()

  if (!pathname?.startsWith("/docs")) {
    return null
  }

  return (
    <div className="sticky top-14 z-30 flex items-center border-b border-border bg-background/95 px-4 py-2 backdrop-blur md:hidden">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <svg
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        侧边菜单
      </button>
    </div>
  )
}
