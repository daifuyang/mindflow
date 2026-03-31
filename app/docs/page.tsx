import { redirect } from "next/navigation"
import { getFirstDocSlug } from "@/lib/docs"

export default function DocsPage() {
  const firstSlug = getFirstDocSlug()
  if (firstSlug) {
    redirect(`/docs/${firstSlug}`)
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-2xl font-bold">知识库</h1>
      <p className="text-muted-foreground">
        暂无文档。请在 content/ 目录下添加 .md 文件。
      </p>
    </div>
  )
}
