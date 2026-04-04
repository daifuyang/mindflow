"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

function markdownToWeChatHTML(md: string): string {
  const lines = md.split("\n")
  const blocks: {
    type: string
    content?: string
    level?: number
    rows?: string[][]
    headers?: string[]
  }[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("```")) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: "code", content: codeLines.join("\n") })
      i++
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headingMatch) {
      blocks.push({
        type: "heading",
        content: headingMatch[2],
        level: headingMatch[1].length,
      })
      i++
      continue
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") })
      continue
    }

    if (/^\|/.test(line)) {
      const rows: string[][] = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim())
        if (cells.length > 0 && !cells.every((c) => /^[-:]+$/.test(c))) {
          rows.push(cells)
        }
        i++
      }
      if (rows.length > 0) {
        const headers = rows[0]
        const dataRows = rows.slice(1)
        blocks.push({ type: "table", headers, rows: dataRows })
      }
      continue
    }

    if (/^[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ""))
        i++
      }
      blocks.push({ type: "ul", content: items.join("\n") })
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""))
        i++
      }
      blocks.push({ type: "ol", content: items.join("\n") })
      continue
    }

    if (line.trim() === "---" || line.trim() === "***") {
      blocks.push({ type: "hr", content: "" })
      i++
      continue
    }

    if (line.trim() === "") {
      i++
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^\|/.test(lines[i]) &&
      lines[i].trim() !== "---" &&
      lines[i].trim() !== "***"
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", content: paraLines.join(" ") })
    }
  }

  function processInline(text: string): string {
    let result = text
    result = result.replace(
      /`([^`]+)`/g,
      '<code style="color:#d32f2f;font-family:Menlo,Monaco,Consolas,monospace;font-size:14px;background:#f5f5f5;padding:2px 4px;border-radius:3px">$1</code>'
    )
    result = result.replace(
      /\*\*\*(.+?)\*\*\*/g,
      '<strong style="font-weight:bold;color:#000;background:transparent"><em style="font-style:italic;background:transparent">$1</em></strong>'
    )
    result = result.replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="font-weight:bold;color:#000;background:transparent">$1</strong>'
    )
    result = result.replace(
      /\*(.+?)\*/g,
      '<em style="font-style:italic;background:transparent">$1</em>'
    )
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color:#576b95;text-decoration:none;border-bottom:1px solid #576b95">$1</a>'
    )
    return result
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }

  let html = ""

  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const sizes: Record<number, string> = {
          1: "26px",
          2: "22px",
          3: "19px",
          4: "18px",
          5: "17px",
          6: "16px",
        }
        const margins: Record<number, string> = {
          1: "30px 0 15px 0",
          2: "24px 0 12px 0",
          3: "20px 0 10px 0",
          4: "18px 0 8px 0",
          5: "16px 0 8px 0",
          6: "16px 0 8px 0",
        }
        const size = sizes[block.level as number] || "16px"
        const margin = margins[block.level as number] || "16px 0 8px 0"
        html += `<h${block.level} style="font-size:${size};font-weight:bold;background:transparent;margin:${margin};line-height:1.4;color:#000">${processInline(block.content || "")}</h${block.level}>`
        break
      }
      case "paragraph":
        html += `<p style="margin:12px 0;line-height:1.8;font-size:16px;background:transparent;color:#333">${processInline(block.content || "")}</p>`
        break
      case "code": {
        const escaped = escapeHtml(block.content || "")
        html += `<pre style="background:#f5f5f5;border:1px solid #e0e0e0;border-radius:4px;padding:12px 16px;margin:12px 0;overflow-x:auto;font-size:14px;line-height:1.6"><code style="font-family:Menlo,Monaco,Consolas,monospace;color:#333">${escaped}</code></pre>`
        break
      }
      case "blockquote": {
        const innerLines = (block.content || "")
          .split("\n")
          .map(
            (l) =>
              `<p style="margin:6px 0;line-height:1.8;font-size:16px;background:transparent;color:#666">${processInline(l)}</p>`
          )
          .join("")
        html += `<blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #999;background:transparent">${innerLines}</blockquote>`
        break
      }
      case "ul": {
        const items = (block.content || "")
          .split("\n")
          .map(
            (item) =>
              `<li style="list-style-type:inherit !important;margin:6px 0;line-height:1.8;background:transparent;color:#333">${processInline(item)}</li>`
          )
          .join("")
        html += `<ul style="list-style-type:disc !important;padding-left:2em !important;margin:12px 0;background:transparent">${items}</ul>`
        break
      }
      case "ol": {
        const items = (block.content || "")
          .split("\n")
          .map(
            (item) =>
              `<li style="list-style-type:inherit !important;margin:6px 0;line-height:1.8;background:transparent;color:#333">${processInline(item)}</li>`
          )
          .join("")
        html += `<ol style="list-style-type:decimal !important;padding-left:2em !important;margin:12px 0;background:transparent">${items}</ol>`
        break
      }
      case "table": {
        const headers = (block.headers || [])
          .map(
            (h) =>
              `<th style="border:1px solid #e0e0e0;padding:8px 12px;background:#fafafa;font-weight:bold;text-align:left;font-size:15px">${processInline(escapeHtml(h))}</th>`
          )
          .join("")
        const bodyRows = (block.rows || [])
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td style="border:1px solid #e0e0e0;padding:8px 12px;font-size:15px">${processInline(escapeHtml(cell))}</td>`).join("")}</tr>`
          )
          .join("")
        html += `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:15px;background:transparent"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`
        break
      }
      case "hr":
        html += `<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;background:transparent">`
        break
    }
  }

  return `<div style="max-width:578px;margin:0 auto;background:transparent;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;line-height:1.8;color:#333;font-size:16px">${html}</div>`
}

type CopyFormat = "markdown" | "wechat"

export function CopyButton({ content }: { content: string }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("已复制到剪贴板")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleCopy = useCallback(
    async (format: CopyFormat) => {
      let message: string
      if (format === "wechat") {
        const html = markdownToWeChatHTML(content)
        const blobHtml = new Blob([html], { type: "text/html" })
        const blobText = new Blob([html], { type: "text/plain" })
        const item = new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        })
        await navigator.clipboard.write([item])
        message = "微信格式已复制"
      } else {
        await navigator.clipboard.writeText(content)
        message = "已复制到剪贴板"
      }
      setToastMessage(message)
      setShowToast(true)
      setOpen(false)
      setTimeout(() => setShowToast(false), 2000)
    },
    [content]
  )

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50" ref={ref}>
        <Button
          variant="outline"
          size="sm"
          className="group gap-1 shadow-lg"
          onClick={() => setOpen(!open)}
        >
          复制
          <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>

        {open && (
          <div className="absolute right-0 bottom-full z-50 mb-1 min-w-[140px] rounded-lg border bg-popover p-1 shadow-md">
            <button
              className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              onClick={() => handleCopy("markdown")}
            >
              复制 Markdown
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              onClick={() => handleCopy("wechat")}
            >
              复制微信格式
            </button>
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-in duration-300 fade-in slide-in-from-bottom-4">
          <div className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
    </>
  )
}
