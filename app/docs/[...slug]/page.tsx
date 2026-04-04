import { notFound } from "next/navigation"
import { getDocContent, getDocTree, TreeNode } from "@/lib/docs"
import { MarkdownRenderer } from "@/components/knowledge-base/markdown-renderer"
import { CopyButton } from "@/components/knowledge-base/copy-button"

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
        {doc.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {doc.description}
          </p>
        )}
      </div>
      <MarkdownRenderer content={doc.content} />
      <CopyButton content={doc.content} />
    </div>
  )
}
