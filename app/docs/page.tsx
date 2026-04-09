import { redirect } from "next/navigation"
import { getFirstDocSlug } from "@/lib/docs"

export default function DocsPage() {
  const firstSlug = getFirstDocSlug()
  if (firstSlug) {
    redirect(`/docs/${firstSlug}`)
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M12 7v14"></path>
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
        </svg>
      </div>
      <h1 className="mb-3 text-xl font-semibold">知识库</h1>
      <p className="max-w-sm text-muted-foreground">
        暂无文档。请在 content/ 目录下添加 Markdown 文件开始构建你的知识库。
      </p>
    </div>
  )
}
