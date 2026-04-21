"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

interface GlobalNavContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const GlobalNavContext = createContext<GlobalNavContextType | null>(null)

export function GlobalNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <GlobalNavContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </GlobalNavContext.Provider>
  )
}

export function useGlobalNav() {
  const context = useContext(GlobalNavContext)
  if (!context) {
    throw new Error("useGlobalNav must be used within GlobalNavProvider")
  }
  return context
}
