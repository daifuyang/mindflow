import Link from "next/link"
import { BookOpen, FolderOpen, FileText, ArrowRight, Layers, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDocTree, getDocContent, TreeNode } from "@/lib/docs"
import { verifyTokenFromCookies } from "@/lib/auth"

function filterTreeByAuth(tree: TreeNode[], isLoggedIn: boolean): TreeNode[] {
  if (isLoggedIn) return tree

  return tree
    .map((node) => {
      if (node.type === "folder" && node.children) {
        const filteredChildren = filterTreeByAuth(node.children, isLoggedIn)
        if (filteredChildren.length === 0) return null
        return { ...node, children: filteredChildren }
      } else if (node.type === "file") {
        if (node.isPublic === false) return null
        return node
      }
      return node
    })
    .filter((node): node is TreeNode => node !== null)
}

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

function CategoryCard({ node }: { node: TreeNode }) {
  const count = node.children?.length || 0
  return (
    <Link href={`/docs/${node.slug}`} className="group block">
      <Card className="relative overflow-hidden border-border/60 bg-card/60 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <FolderOpen className="size-5 text-primary" />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">{node.title}</h3>
          <p className="text-sm text-muted-foreground">{count} 篇文章</p>
          <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>查看</span>
            <ArrowRight className="size-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function DocCard({ node }: { node: TreeNode }) {
  const doc = getDocContent(node.slug.split("/"))
  if (!doc) return null

  const firstLine = doc.content.split("\n").find((line) => line.trim()) || ""
  const description = firstLine.replace(/^[-*#>\s]+/, "").slice(0, 100)
  const category = node.slug.split("/")[0]

  return (
    <Link href={`/docs/${node.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-border/60 bg-card/60 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
        <CardContent className="p-4">
          <Badge variant="outline" className="mb-3 text-xs">
            {category}
          </Badge>
          <h4 className="mb-2 line-clamp-1 font-medium text-foreground group-hover:text-primary">
            {node.title}
          </h4>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description || "暂无描述"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function Page() {
  const isLoggedIn = await verifyTokenFromCookies()
  const allTree = getDocTree()
  const tree = filterTreeByAuth(allTree, isLoggedIn)
  const allFiles = collectFiles(tree)
  const recentDocs = allFiles.slice(0, 6)
  const categories = tree.filter((node) => node.type === "folder")

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto">
            <div className="mx-auto max-w-2xl text-center px-4">
              <Badge variant="outline" className="mb-5 gap-1.5 px-3 py-1">
                <Layers className="size-3" />
                知识管理系统
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                沉淀思考
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {" "}连接知识
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">
                基于文件系统构建的个人知识库，Markdown 编写，结构化组织，让知识有序流动。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/docs"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  探索知识库
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/docs/about/daifuyang"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
                >
                  关于我
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight md:text-xl">知识分类</h2>
                  <p className="text-sm text-muted-foreground">按主题组织的内容</p>
                </div>
              </div>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                  <CategoryCard key={cat.slug} node={cat} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/20">
          <div className="py-12 md:py-16">
            <div className="container mx-auto">
              <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight md:text-xl">最近更新</h2>
                    <p className="text-sm text-muted-foreground">最新文档</p>
                  </div>
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {recentDocs.map((doc) => (
                    <DocCard key={doc.slug} node={doc} />
                  ))}
                </div>
                {allFiles.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link
                      href="/docs"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      查看全部 {allFiles.length} 篇文档
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="container mx-auto py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-3.5 text-primary" />
                </div>
                <span className="font-semibold tracking-tight text-sm">MIND FLOW</span>
              </div>
              <p className="text-xs text-muted-foreground">
                共 {allFiles.length} 篇文档
              </p>
              <p className="text-xs text-muted-foreground">
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  苏ICP备16008291号
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}