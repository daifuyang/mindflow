import { getDocTree } from "@/lib/docs"
import { FileTree } from "@/components/knowledge-base/file-tree"
import { MobileSidebar } from "@/components/knowledge-base/mobile-sidebar"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = getDocTree()

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="hidden w-[260px] shrink-0 border-r border-border bg-sidebar md:block">
        <div className="sticky top-0 flex h-svh flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                <BookOpen className="size-4 text-primary" />
              </div>
              <span className="font-semibold">MindFlow</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileTree tree={tree} />
          </div>
        </div>
      </aside>

      <MobileSidebar tree={tree} />

      <main className="min-w-0 flex-1 pl-14 md:pl-0">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
