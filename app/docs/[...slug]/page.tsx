import { notFound } from "next/navigation"
import { getDocContent } from "@/lib/docs"
import { MarkdownRenderer } from "@/components/knowledge-base/markdown-renderer"

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
    </div>
  )
}
