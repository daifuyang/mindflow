"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { cn } from "@/lib/utils"

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article
      className={cn(
        "max-w-none",
        // Headings
        "[&>h1]:mt-10 [&>h1]:mb-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:tracking-tight [&>h1]:text-foreground",
        "[&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-border [&>h2]:pb-3 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-foreground",
        "[&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-foreground",
        "[&>h4]:mt-6 [&>h4]:mb-2 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-foreground",
        // Paragraphs
        "[&>p]:my-5 [&>p]:text-[15px] [&>p]:leading-7 [&>p]:text-foreground",
        // Links
        "[&_a]:break-all [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-primary/80",
        // Strong and emphasis
        "[&>strong]:font-semibold [&>strong]:text-foreground",
        "[&>em]:italic",
        "[&>del]:text-muted-foreground [&>del]:line-through",
        // Blockquote
        "[&>blockquote]:my-6 [&>blockquote]:rounded-lg [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:bg-primary/5 [&>blockquote]:px-5 [&>blockquote]:py-3.5 [&>blockquote]:not-italic",
        "[&>blockquote>p]:my-0 [&>blockquote>p]:text-muted-foreground",
        // Lists
        "[&>ul]:my-5 [&>ul]:ml-6 [&>ul]:list-disc [&>ul]:space-y-2",
        "[&>ol]:my-5 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol]:space-y-2",
        "[&>li]:my-2 [&>li]:text-[15px] [&>li]:leading-7 [&>li]:text-foreground",
        "[&>li>ul]:mt-2 [&>li>ul]:mb-0",
        "[&>li>ol]:mt-2 [&>li>ol]:mb-0",
        "[&>li>p]:my-0",
        // Inline code
        "[&>code:not(pre>code)]:rounded [&>code:not(pre>code)]:border [&>code:not(pre>code)]:border-border/50 [&>code:not(pre>code)]:bg-muted/80 [&>code:not(pre>code)]:px-1.5 [&>code:not(pre>code)]:py-0.5 [&>code:not(pre>code)]:font-mono [&>code:not(pre>code)]:text-[0.875em] [&>code:not(pre>code)]:text-foreground",
        // Code blocks
        "[&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>pre]:bg-muted [&>pre]:px-4 [&>pre]:py-3 [&>pre]:text-[14px]",
        "[&>pre>code]:min-w-0 [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:font-mono [&>pre>code]:leading-relaxed [&>pre>code]:whitespace-pre-wrap [&>pre>code]:text-foreground",
        // Tables - Zebra striping (stronger contrast)
        "[&>table]:my-6 [&>table]:w-full [&>table]:table-fixed [&>table]:overflow-x-auto [&>table]:rounded-lg [&>table]:border [&>table]:border-[oklch(0.8_0_0)] [&>table]:text-sm",
        "[&>table>thead]:bg-muted",
        "[&>table>thead>tr>th]:w-[25%] [&>table>thead>tr>th]:border-b [&>table>thead>tr>th]:border-[oklch(0.8_0_0)] [&>table>thead>tr>th]:px-3 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:text-sm [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:whitespace-nowrap [&>table>thead>tr>th]:text-foreground",
        "[&>table>tbody>tr>td]:px-3 [&>table>tbody>tr>td]:py-3 [&>table>tbody>tr>td]:text-[14px] [&>table>tbody>tr>td]:break-words [&>table>tbody>tr>td]:text-muted-foreground",
        "[&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-[oklch(0.85_0_0)]",
        "[&>table>tbody>tr:nth-child(even)>td]:bg-muted/60",
        "[&>table>tbody>tr:hover>td]:bg-muted/80",
        // Horizontal rule
        "[&>hr]:my-10 [&>hr]:border-border/50",
        // Images
        "[&>img]:my-8 [&>img]:max-w-full [&>img]:rounded-lg [&>img]:shadow-lg",
        // Checkboxes
        "[&>input[type=checkbox]]:mr-2 [&>input[type=checkbox]]:size-4 [&>input[type=checkbox]]:accent-primary"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
