import { getDocTree } from "@/lib/docs"
import { FileTree } from "@/components/knowledge-base/file-tree"
import { SidebarMenuButton } from "@/components/knowledge-base/sidebar-menu-button"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = getDocTree()

  return (
    <>
      <SidebarMenuButton />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden w-[260px] shrink-0 border-r border-border bg-sidebar md:block">
          <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <FileTree tree={tree} />
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 justify-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8 md:py-12">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
