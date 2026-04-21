"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { TreeNode } from "@/lib/docs"

interface DocSidebarContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  tree: TreeNode[]
}

const DocSidebarContext = createContext<DocSidebarContextType | null>(null)

export function DocSidebarProvider({
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
    <DocSidebarContext.Provider value={{ isOpen, open, close, toggle, tree }}>
      {children}
    </DocSidebarContext.Provider>
  )
}

export function useDocSidebar() {
  const context = useContext(DocSidebarContext)
  if (!context) {
    throw new Error("useDocSidebar must be used within DocSidebarProvider")
  }
  return context
}
