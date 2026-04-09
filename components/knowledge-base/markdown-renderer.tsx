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
        "[&>*+*]:mt-5",
        "[&>h1]:mt-10 [&>h1]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:tracking-tight [&>h1]:first:mt-0",
        "[&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-border [&>h2]:pb-2 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:tracking-tight",
        "[&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:tracking-tight",
        "[&>h4]:mt-6 [&>h4]:mb-2 [&>h4]:text-lg [&>h4]:font-semibold",
        "[&>p]:leading-7 [&>p]:text-foreground/90",
        "[&>a]:font-medium [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary/80",
        "[&>strong]:font-semibold [&>strong]:text-foreground",
        "[&>em]:italic",
        "[&>del]:text-muted-foreground [&>del]:line-through",
        "[&>blockquote]:mt-6 [&>blockquote]:rounded-r-md [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:bg-primary/5 [&>blockquote]:px-4 [&>blockquote]:py-2 [&>blockquote]:text-muted-foreground [&>blockquote]:not-italic",
        "[&>blockquote_p]:mb-0",
        "[&>ul]:my-4 [&>ul]:ml-5 [&>ul]:list-disc [&>ul]:space-y-1.5",
        "[&>ol]:my-4 [&>ol]:ml-5 [&>ol]:list-decimal [&>ol]:space-y-1.5",
        "[&>li]:leading-6 [&>li]:text-foreground/90",
        "[&>li_ul]:mt-2",
        "[&>li_ol]:mt-2",
        "[&>code:not(pre_code)]:rounded [&>code:not(pre_code)]:bg-muted/80 [&>code:not(pre_code)]:px-1.5 [&>code:not(pre_code)]:py-0.5 [&>code:not(pre_code)]:font-mono [&>code:not(pre_code)]:text-[0.875em] [&>code:not(pre_code)]:text-foreground",
        "[&>pre]:my-6 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border/50 [&>pre]:bg-muted/40 [&>pre]:p-4",
        "[&>pre_code]:bg-transparent [&>pre_code]:p-0 [&>pre_code]:font-mono [&>pre_code]:text-[0.875em] [&>pre_code]:leading-relaxed [&>pre_code]:text-foreground",
        "[&>table]:my-6 [&>table]:w-full [&>table]:border-collapse [&>table]:overflow-hidden [&>table]:rounded-lg [&>table]:border [&>table]:border-border [&>table]:text-sm",
        "[&>thead]:bg-muted/50",
        "[&>th]:border-b [&>th]:border-border [&>th]:px-4 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold [&>th]:text-foreground",
        "[&>td]:border-b [&>td]:border-border/50 [&>td]:px-4 [&>td]:py-2.5",
        "[&>tr:last-child_td]:border-b-0",
        "[&>tr:nth-child(even)]:bg-muted/20",
        "[&>hr]:my-10 [&>hr]:border-border/50",
        "[&>img]:my-6 [&>img]:max-w-full [&>img]:rounded-lg [&>img]:shadow-md",
        "[&>input[type=checkbox]]:mr-2 [&>input[type=checkbox]]:accent-primary",
        "[&>.note]:mt-6 [&>.note]:rounded-lg [&>.note]:border-l-4 [&>.note]:border-primary/40 [&>.note]:bg-primary/5 [&>.note]:px-4 [&>.note]:py-3"
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
