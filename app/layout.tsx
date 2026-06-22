import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { AdminHeader } from "@/components/admin-header"
import { GlobalNavProvider } from "@/components/knowledge-base/global-nav-context"
import { GlobalNavOverlay } from "@/components/knowledge-base/global-nav-overlay"
import { DocSidebarProvider } from "@/components/knowledge-base/doc-sidebar-context"
import { DocSidebar } from "@/components/knowledge-base/doc-sidebar"
import { getDocTree } from "@/lib/docs"
import { verifyTokenFromCookies } from "@/lib/auth"
import type { TreeNode } from "@/lib/docs"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

function filterTreeByAuth(tree: TreeNode[], isLoggedIn: boolean): TreeNode[] {
  if (isLoggedIn) return tree

  return tree
    .map((node) => {
      if (node.type === "folder" && node.children) {
        const filteredChildren = filterTreeByAuth(node.children, isLoggedIn)
        if (filteredChildren.length === 0) return null
        return { ...node, children: filteredChildren }
      } else if (node.type === "file") {
        if (node.isPublic === false) return null
        return node
      }
      return node
    })
    .filter((node): node is TreeNode => node !== null)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isLoggedIn = await verifyTokenFromCookies()
  const allTree = getDocTree()
  const tree = filterTreeByAuth(allTree, isLoggedIn)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <DocSidebarProvider tree={tree}>
            <GlobalNavProvider>
              <AdminHeader />
              {children}
              <DocSidebar />
              <GlobalNavOverlay />
            </GlobalNavProvider>
          </DocSidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
