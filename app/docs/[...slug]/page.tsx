import { notFound, redirect } from "next/navigation"
import {
  getDocContent,
  getDocTree,
  getBreadcrumbs,
  getFolderFirstDocSlug,
  getPrevNextDocs,
  isFolder,
  TreeNode,
} from "@/lib/docs"
import { verifyTokenFromCookies } from "@/lib/auth"
import { MarkdownRenderer } from "@/components/knowledge-base/markdown-renderer"
import { CopyButton } from "@/components/knowledge-base/copy-button"
import { Breadcrumbs } from "@/components/knowledge-base/breadcrumbs"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

export async function generateStaticParams() {
  const tree = getDocTree()
  return collectSlugs(tree).map((slug) => ({ slug }))
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const fullSlug = slug.join("/")
  const tree = getDocTree()
  const isLoggedIn = await verifyTokenFromCookies()

  if (isFolder(tree, fullSlug)) {
    const firstDoc = getFolderFirstDocSlug(fullSlug)
    if (firstDoc) {
      redirect(`/docs/${firstDoc}`)
    }
  }

  const doc = getDocContent(slug)

  if (!doc) {
    notFound()
  }

  if (!doc.isPublic && !isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-muted p-4 mb-6">
          <Lock className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">这篇文档是私密的</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          这是一篇内部文档，需要登录后才能查看。
        </p>
        <Link
          href={`/login?redirect=/docs/${fullSlug}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          登录后查看
        </Link>
      </div>
    )
  }

  const breadcrumbs = getBreadcrumbs(slug)
  const { prev, next } = getPrevNextDocs(slug)

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
        <h1 className="text-2xl font-bold tracking-tight break-words sm:text-3xl">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {doc.description}
          </p>
        )}
      </header>

      <MarkdownRenderer content={doc.content} />

      {isLoggedIn && (
        <div className="mt-12 border-t border-border/50 pt-6">
          <CopyButton content={doc.content} />
        </div>
      )}

      {(prev || next) && (
        <nav className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row">
          {prev && (
            <Link
              href={`/docs/${prev.slug}`}
              className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3"
            >
              <span className="text-xs text-muted-foreground">上一篇</span>
              <div className="flex items-center gap-2">
                <ChevronLeft className="size-4 shrink-0" />
                <span className="break-words">{prev.title}</span>
              </div>
            </Link>
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3 sm:ml-auto"
            >
              <span className="text-xs text-muted-foreground">下一篇</span>
              <div className="flex items-center justify-between gap-2">
                <span className="break-words">{next.title}</span>
                <ChevronRight className="size-4 shrink-0" />
              </div>
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
