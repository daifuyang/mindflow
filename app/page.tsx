import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <BookOpen className="size-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">MindFlow</h1>
          <p className="mt-2 text-muted-foreground">
            现代化的知识库管理工具
          </p>
        </div>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <BookOpen className="size-4" />
          进入知识库
        </Link>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
