import type { MetadataRoute } from "next"

import { getPublicDocTree, type TreeNode } from "@/lib/docs"
import { SITE_URL } from "@/lib/site"

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

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = collectFiles(getPublicDocTree())

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docs.map((doc) => ({
      url: `${SITE_URL}/docs/${doc.slug}`,
      lastModified: doc.date ? new Date(doc.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: doc.slug.startsWith("writings/") ? 0.8 : 0.6,
    })),
  ]
}
