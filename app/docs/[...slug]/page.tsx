import { notFound, redirect } from "next/navigation"
import {
  getDocContent,
  getDocTree,
  getPublicDocTree,
  getBreadcrumbs,
  getFolderFirstDocSlug,
  getPrevNextDocs,
  isPubliclyVisibleDoc,
  isFolder,
  TreeNode,
} from "@/lib/docs"
import {
  absoluteUrl,
  AUTHOR_NAME,
  AUTHOR_URL,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"
import { verifyTokenFromCookies } from "@/lib/auth"
import { MarkdownRenderer } from "@/components/knowledge-base/markdown-renderer"
import { CopyButton } from "@/components/knowledge-base/copy-button"
import { Breadcrumbs } from "@/components/knowledge-base/breadcrumbs"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

function formatDocDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed)
}

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

function getDescription(doc: NonNullable<ReturnType<typeof getDocContent>>) {
  if (doc.description) return doc.description

  return (
    doc.content
      .split("\n")
      .find((line) => line.trim() && !line.trim().startsWith("#"))
      ?.replace(/^[-*#>\s]+/, "")
      .slice(0, 150) || `${doc.title}，来自${SITE_NAME}。`
  )
}

function getOgImage(doc: NonNullable<ReturnType<typeof getDocContent>>) {
  return (
    doc.cover?.wechat ||
    doc.cover?.zhihu ||
    doc.cover?.juejin ||
    DEFAULT_OG_IMAGE
  )
}

export async function generateStaticParams() {
  const tree = getPublicDocTree()
  return collectSlugs(tree).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocContent(slug)

  if (!doc) {
    return {
      title: "页面不存在",
      robots: { index: false, follow: false },
    }
  }

  const path = `/docs/${slug.join("/")}`
  const description = getDescription(doc)
  const image = absoluteUrl(getOgImage(doc))
  const indexable = isPubliclyVisibleDoc(doc)

  return {
    title: doc.title,
    description,
    keywords: doc.tags,
    alternates: {
      canonical: path,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "article",
      locale: "zh_CN",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title: doc.title,
      description,
      publishedTime: doc.date,
      authors: [AUTHOR_NAME],
      tags: doc.tags,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description,
      images: [image],
    },
  }
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
    const firstDoc = getFolderFirstDocSlug(fullSlug, !isLoggedIn)
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-muted p-4">
          <Lock className="size-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">这篇文档是私密的</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
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

  if (!isPubliclyVisibleDoc(doc) && !isLoggedIn) {
    notFound()
  }

  const breadcrumbs = getBreadcrumbs(slug)
  const { prev, next } = getPrevNextDocs(slug)
  const path = `/docs/${fullSlug}`
  const description = getDescription(doc)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description,
    datePublished: doc.date,
    dateModified: doc.date,
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(getOgImage(doc)),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: doc.tags?.join(","),
  }

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        {doc.date && (
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{formatDocDate(doc.date)}</span>
            <span>·</span>
            <span className="font-medium text-foreground/70">富阳说</span>
          </div>
        )}
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
