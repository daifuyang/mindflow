"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TreeNode } from "@/lib/docs"

function isNodeActive(node: TreeNode, currentSlug: string): boolean {
  if (node.type === "file") return `/docs/${node.slug}` === currentSlug
  if (node.children) {
    return node.children.some((child) => isNodeActive(child, currentSlug))
  }
  return false
}

function TreeItem({
  node,
  depth = 0,
  onNavigate,
}: {
  node: TreeNode
  depth?: number
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive = node.type === "file" && pathname === `/docs/${node.slug}`
  const hasActiveChild =
    node.type === "folder" && isNodeActive(node, pathname)
  const [isOpen, setIsOpen] = useState(hasActiveChild)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            hasActiveChild && "text-foreground",
            !hasActiveChild && "text-muted-foreground"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 transition-transform",
              isOpen && "rotate-90"
            )}
          />
          {isOpen ? (
            <FolderOpen className="size-4 shrink-0 text-primary" />
          ) : (
            <Folder className="size-4 shrink-0 text-primary" />
          )}
          <span className="truncate">{node.title}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.slug}
                node={child}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={`/docs/${node.slug}`}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 8 + 18}px` }}
    >
      <FileText className="size-3.5 shrink-0" />
      <span className="truncate">{node.title}</span>
    </Link>
  )
}

export function FileTree({
  tree,
  onNavigate,
}: {
  tree: TreeNode[]
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-0.5 px-2 py-2">
      {tree.map((node) => (
        <TreeItem key={node.slug} node={node} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
