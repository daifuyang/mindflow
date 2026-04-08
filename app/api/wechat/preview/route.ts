import { NextResponse } from "next/server"
import { markdownToWeChatHTML } from "@/lib/wechat"

export async function POST(request: Request) {
  const { title, content, author } = await request.json()
  const htmlContent = markdownToWeChatHTML(content)

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title || "预览"}</title>
</head>
<body style="margin:0;padding:20px;background:#f5f5f5">
  <div style="max-width:578px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
    <h1 style="font-size:24px;text-align:center;margin-bottom:20px;color:#333">${title || "无标题"}</h1>
    <div style="text-align:center;color:#999;font-size:14px;margin-bottom:20px">${author || "富阳说"}</div>
    ${htmlContent}
  </div>
</body>
</html>`

  return new NextResponse(fullHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
