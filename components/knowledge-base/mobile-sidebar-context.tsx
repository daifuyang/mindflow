"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { TreeNode } from "@/lib/docs"

interface MobileSidebarContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  tree: TreeNode[]
}

const MobileSidebarContext = createContext<MobileSidebarContextType | null>(
  null
)

export function MobileSidebarProvider({
  children,
  tree,
}: {
  children: ReactNode
  tree: TreeNode[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <MobileSidebarContext.Provider
      value={{ isOpen, open, close, toggle, tree }}
    >
      {children}
    </MobileSidebarContext.Provider>
  )
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext)
  if (!context) {
    throw new Error(
      "useMobileSidebar must be used within MobileSidebarProvider"
    )
  }
  return context
}
