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
import {
  absoluteUrl,
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  THEME_COLOR,
} from "@/lib/site"
import { isIndexableStatus, type TreeNode } from "@/lib/docs"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: "https://daifuyang.com" }],
  category: "technology",
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  other: {
    "msapplication-TileColor": THEME_COLOR,
    "og:logo": absoluteUrl(SITE_LOGO),
  },
}

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
        if (!isIndexableStatus(node.status)) return null
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
      lang="zh-CN"
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
