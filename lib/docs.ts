import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type TreeNode = {
  name: string
  slug: string
  type: "file" | "folder"
  title?: string
  order?: number
  children?: TreeNode[]
}

export type DocContent = {
  title: string
  description?: string
  content: string
  slug: string[]
}

type MetaConfig = {
  title?: string
  order?: number
}

const CONTENT_DIR = path.join(process.cwd(), "content")

function readMeta(dir: string): MetaConfig | null {
  const metaPath = path.join(dir, "_meta.json")
  if (!fs.existsSync(metaPath)) return null
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as MetaConfig
  } catch {
    return null
  }
}

function buildTree(dir: string, basePath: string[] = []): TreeNode[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const nodes: TreeNode[] = []

  for (const entry of entries) {
    if (entry.name === "_meta.json") continue

    const fullPath = path.join(dir, entry.name)
    const currentPath = [...basePath, entry.name]

    if (entry.isDirectory()) {
      const children = buildTree(fullPath, currentPath)
      if (children.length === 0) continue

      const meta = readMeta(fullPath)

      nodes.push({
        name: entry.name,
        slug: currentPath.join("/"),
        type: "folder",
        title: meta?.title || formatName(entry.name),
        order: meta?.order,
        children,
      })
    } else if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(fullPath, "utf-8")
      const { data } = matter(raw)
      const nameWithoutExt = entry.name.replace(/\.md$/, "")
      const slug = [...basePath, nameWithoutExt]

      nodes.push({
        name: nameWithoutExt,
        slug: slug.join("/"),
        type: "file",
        title: (data.title as string) || formatName(nameWithoutExt),
        order: data.order as number | undefined,
      })
    }
  }

  return nodes.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.name.localeCompare(b.name)
  })
}

function formatName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getDocTree(): TreeNode[] {
  return buildTree(CONTENT_DIR)
}

export function getDocContent(slug: string[]): DocContent | null {
  const filePath = path.join(CONTENT_DIR, ...slug) + ".md"

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  const body = content.replace(/^\s*#\s+.+\n*/, "")

  return {
    title: (data.title as string) || formatName(slug[slug.length - 1]),
    description: data.description as string | undefined,
    content: body,
    slug,
  }
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

export function getFirstDocSlug(): string | null {
  const tree = getDocTree()
  const files = collectFiles(tree)
  if (files.length === 0) return null
  return files[0].slug
}
