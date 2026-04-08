"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setAuthenticated(false)
    router.push("/login")
  }

  if (loading) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            MindFlow
          </Link>
          <nav className="flex gap-4 text-sm">
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
              <Link
                href="/admin"
                className={
                  pathname?.startsWith("/admin")
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                管理
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  )
}
