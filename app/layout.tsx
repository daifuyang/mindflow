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

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const tree = getDocTree()

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
