import Link from "next/link"
import { BookOpen, Zap, Globe, Shield } from "lucide-react"

export default function Page() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative flex min-h-svh flex-col">
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="size-5 text-primary" />
              </div>
              <span className="text-lg font-semibold">MindFlow</span>
            </div>
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/docs"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                文档
              </Link>
              <Link
                href="/docs/about/daifuyang"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                关于
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                开始使用
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                <Zap className="size-3.5" />
                现代化的知识库管理
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-foreground">轻松管理你的</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  技术知识库
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                基于 Markdown 的文件系统知识库，支持 AI 辅助写作，
                <br className="hidden sm:block" />
                让知识管理变得简单高效。
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/docs"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  <BookOpen className="size-5" />
                  进入知识库
                  <svg
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/docs/about/daifuyang"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Markdown 驱动",
                  description: "基于文件系统，纯文本存储，版本控制友好",
                },
                {
                  icon: Zap,
                  title: "AI 辅助写作",
                  description: "集成 OpenCode Skills，AI 懂你的写作规范",
                },
                {
                  icon: Globe,
                  title: "多平台发布",
                  description: "支持微信公众号、掘金等多平台一键发布",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative rounded-xl border border-border/50 bg-background/50 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border/50 bg-muted/30">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div>
                  <h3 className="font-semibold">快速导航</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    从这里开始探索 MindFlow
                  </p>
                </div>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                  浏览全部文档
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border/50">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex size-6 items-center justify-center rounded bg-primary/10">
                  <BookOpen className="size-3 text-primary" />
                </div>
                <span>MIND FLOW</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Built with Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
