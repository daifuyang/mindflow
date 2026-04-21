"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X, Home, BookOpen, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalNav } from "./global-nav-context"
import { usePathname, useRouter } from "next/navigation"

export function GlobalNavOverlay() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, close } = useGlobalNav()

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

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    close()
    router.push("/login")
  }

  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("admin_token")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={close}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 w-80 max-w-[85vw] border-l border-border bg-sidebar",
          "animate-in duration-200 slide-in-from-right"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-end border-b border-border px-4">
            <button
              onClick={close}
              className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <Link
              href="/"
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Home className="size-5" />
              首页
            </Link>
            <Link
              href="/docs"
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <BookOpen className="size-5" />
              知识库
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <User className="size-5" />
                  我的
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogOut className="size-5" />
                  退出登录
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={close}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <User className="size-5" />
                登录
              </Link>
            )}
          </nav>
        </div>
      </aside>
    </div>
  )
}
