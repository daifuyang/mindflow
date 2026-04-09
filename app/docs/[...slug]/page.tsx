import { notFound } from "next/navigation"
import { getDocContent, getDocTree, getBreadcrumbs, TreeNode } from "@/lib/docs"
import { MarkdownRenderer } from "@/components/knowledge-base/markdown-renderer"
import { CopyButton } from "@/components/knowledge-base/copy-button"
import { Breadcrumbs } from "@/components/knowledge-base/breadcrumbs"
import { Clock } from "lucide-react"

function collectSlugs(nodes: TreeNode[]): string[][] {
  const slugs: string[][] = []
  for (const node of nodes) {
    if (node.type === "file") {
      slugs.push(node.slug.split("/"))
    } else if (node.children) {
      slugs.push(...collectSlugs(node.children))
    }
  }
  return slugs
}

export function generateStaticParams() {
  const tree = getDocTree()
  return collectSlugs(tree).map((slug) => ({ slug }))
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const doc = getDocContent(slug)

  if (!doc) {
    notFound()
  }

  const breadcrumbs = getBreadcrumbs(slug)

  return (
    <div className="relative">
      <div className="mb-6">
        <Breadcrumbs
          items={breadcrumbs.slice(1).map((b) => ({
            label: b.title,
            href: `/docs/${b.slug}`,
          }))}
          className="mb-4"
        />
      </div>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
        {doc.description && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {doc.description}
          </p>
        )}
      </header>

      <MarkdownRenderer content={doc.content} />

      <div className="mt-12 border-t border-border/50 pt-6">
        <CopyButton content={doc.content} />
      </div>
    </div>
  )
}
