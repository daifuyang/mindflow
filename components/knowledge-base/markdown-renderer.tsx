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
        "[&>*]:mb-4 [&>*:last-child]:mb-0",
        "[&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:first:mt-0",
        "[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold",
        "[&_p]:leading-7 [&_p]:text-foreground/90",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        "[&_del]:text-muted-foreground [&_del]:line-through",
        "[&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:bg-muted/30 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_blockquote_p]:mb-0",
        "[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1",
        "[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-1",
        "[&_li]:leading-7 [&_li]:text-foreground/90",
        "[&_li_ul]:mt-1 [&_li_ol]:mt-1",
        "[&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-muted [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_code:not(pre_code)]:text-foreground",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed",
        "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:text-sm",
        "[&_thead]:bg-muted/50",
        "[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2",
        "[&_tr:nth-child(even)]:bg-muted/20",
        "[&_hr]:my-8 [&_hr]:border-border",
        "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg",
        "[&_input[type=checkbox]]:mr-2 [&_input[type=checkbox]]:accent-primary"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
