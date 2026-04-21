import Link from "next/link"
import { BookOpen, Zap, FolderOpen, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDocTree, getDocContent, TreeNode } from "@/lib/docs"

function collectFiles(nodes: TreeNode[]): TreeNode[] {
  const files: TreeNode[] = []
  for (const node of nodes) {
    if (node.type === "file") {
      files.push(node)
    } else if (node.children) {
      files.push(...collectFiles(node.children))
    }
  }
  return files
}

function DocCard({ node }: { node: TreeNode }) {
  const doc = getDocContent(node.slug.split("/"))
  if (!doc) return null

  const firstLine = doc.content.split("\n").find((line) => line.trim()) || ""
  const description = firstLine.replace(/^[-*#>\s]+/, "").slice(0, 100)

  return (
    <Link href={`/docs/${node.slug}`} className="block">
      <Card className="h-full border-border/50 bg-card/80 shadow-none transition-colors hover:border-primary/50 hover:bg-card">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {node.slug.split("/")[0]}
            </Badge>
          </div>
          <CardTitle className="mt-4 line-clamp-1 text-lg">
            {node.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description || "暂无描述"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function Page() {
  const tree = getDocTree()
  const allFiles = collectFiles(tree)
  const recentDocs = allFiles.slice(0, 6)

  const categories = tree.filter((node) => node.type === "folder")

  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden px-4 md:px-8">
      <main className="flex-1">
        <section className="container mx-auto py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 md:mb-6">
              <Zap className="mr-1 size-3" />
              个人知识库
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-foreground">我的</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                知识沉淀
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
              基于 Markdown 的文件系统知识库，记录思考、沉淀技术、分享经验。
            </p>
            <div className="mt-10 flex flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                查看全部
              </Link>
              <Link
                href="/docs/about/daifuyang"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
              >
                关于我
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                知识分类
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/docs/${cat.slug}`}>
                  <Card className="border-border/50 bg-card/80 shadow-none transition-colors hover:border-primary/50 hover:bg-card">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FolderOpen className="size-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{cat.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat.children?.length || 0} 篇
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30">
          <div className="container mx-auto py-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-center gap-2">
                <Clock className="size-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  最近更新
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentDocs.map((doc) => (
                  <DocCard key={doc.slug} node={doc} />
                ))}
              </div>
              {allFiles.length > 6 && (
                <div className="mt-8 text-center">
                  <Link
                    href="/docs"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <FolderOpen className="size-5" />
                    查看全部
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-8">
          <div className="mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex size-6 items-center justify-center rounded bg-primary/10">
                <BookOpen className="size-3 text-primary" />
              </div>
              <span>MIND FLOW</span>
            </div>
            <p className="text-sm text-muted-foreground">
              共 {allFiles.length} 篇文档
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
