"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { useGlobalNav } from "@/components/knowledge-base/global-nav-context"
import { ThemeToggle } from "@/components/knowledge-base/theme-toggle"

function checkAuth() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("admin_token")
  }
  return false
}

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(checkAuth)
  const { toggle: toggleGlobalNav } = useGlobalNav()

  useEffect(() => {
    setAuthenticated(checkAuth())
  }, [pathname])

  const handleLogout = async () => {
    localStorage.removeItem("admin_token")
    await fetch("/api/auth/logout", { method: "POST" })
    setAuthenticated(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            MindFlow
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link
              href="/docs"
              className={
                pathname?.startsWith("/docs")
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            >
              知识库
            </Link>
            {authenticated && (
              <>
                <Link
                  href="/admin/todos"
                  className={
                    pathname?.startsWith("/admin/todos")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  待办
                </Link>
                <Link
                  href="/admin"
                  className={
                    pathname === "/admin"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  管理
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            {authenticated ? (
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                退出登录
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                登录
              </Link>
            )}
          </div>
          <ThemeToggle />
          <button
            onClick={toggleGlobalNav}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border/50 bg-background hover:bg-accent md:hidden"
            aria-label="Toggle global menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
