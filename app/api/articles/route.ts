import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const articlesDir = path.join(process.cwd(), "content/media-planning/articles")

export async function GET() {
  if (!fs.existsSync(articlesDir)) {
    return NextResponse.json([])
  }

  const articles: {
    slug: string
    title: string
    date: string
    status: string
  }[] = []

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        walkDir(fullPath)
      } else if (file.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf-8")
        const { data } = matter(content)
        const relativePath = fullPath
          .replace(articlesDir, "")
          .replace(".md", "")
        articles.push({
          slug: `/docs/media-planning/articles${relativePath}`,
          title: data.title || "无标题",
          date: data.date || "",
          status: data.status || "draft",
        })
      }
    }
  }

  walkDir(articlesDir)

  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return NextResponse.json(articles)
}
