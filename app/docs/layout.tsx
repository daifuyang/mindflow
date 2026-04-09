import { getDocTree } from "@/lib/docs"
import { FileTree } from "@/components/knowledge-base/file-tree"
import { MobileSidebar } from "@/components/knowledge-base/mobile-sidebar"

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
          <div className="flex-1 overflow-y-auto">
            <FileTree tree={tree} />
          </div>
        </div>
      </aside>

      <MobileSidebar tree={tree} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
