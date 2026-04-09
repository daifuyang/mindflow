"use client"

import { useState, useEffect } from "react"

interface Article {
  slug: string
  title: string
  date: string
  status: string
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [wechatConfigured, setWechatConfigured] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    fetch("/api/auth", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          window.location.href = "/login"
        } else {
          setAuthorized(true)
        }
      })
      .catch(() => (window.location.href = "/login"))

    fetch("/api/wechat/token")
      .then((res) => res.json())
      .then((data) => setWechatConfigured(data.configured))
      .catch(() => setWechatConfigured(false))
  }, [])

  useEffect(() => {
    if (!authorized) return
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch(console.error)
  }, [authorized])

  const loadArticleContent = (article: Article) => {
    setSelectedArticle(article)
    fetch(article.slug)
      .then((res) => res.text())
      .then((html) => {
        const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/)
        const textContent = (contentMatch?.[1] || html)
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim()
        setContent(textContent)
      })
      .catch(console.error)
  }

  const handlePublish = async () => {
    if (!selectedArticle || !content) return

    setLoading(true)
    setMessage("正在发布...")

    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/wechat/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: selectedArticle.title,
        content: content,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setMessage(`发布成功！mediaId: ${data.mediaId}`)
    } else if (data.message?.includes("invalid media_id")) {
      setMessage(
        "API权限不足：草稿箱功能需要微信官方内测权限。当前可使用「复制微信格式」功能手动发布。"
      )
    } else {
      setMessage(`发布失败: ${data.message}`)
    }
    setLoading(false)
  }

  const handleCopyWechatFormat = async () => {
    if (!content) return
    setLoading(true)
    try {
      const res = await fetch("/api/wechat/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: selectedArticle?.title || "", content }),
      })
      const html = await res.text()
      const blob = new Blob([html], { type: "text/html" })
      const item = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([content], { type: "text/plain" }),
      })
      await navigator.clipboard.write([item])
      setMessage("已复制微信格式！请到公众号后台粘贴。")
    } catch {
      setMessage("复制失败，请手动复制内容。")
    }
    setLoading(false)
  }

  const handlePreview = () => {
    if (!selectedArticle || !content) return
    const params = new URLSearchParams({
      title: selectedArticle.title,
      content: content,
    })
    window.open(`/api/wechat/preview?${params}`, "_blank")
  }

  if (!authorized) return null

  if (!wechatConfigured) {
    return (
      <div className="container py-8">
        <h1 className="mb-4 text-2xl font-bold">文章管理</h1>
        <div className="rounded-lg border bg-yellow-50 p-4 text-yellow-800">
          微信未配置，请在 .env.local 中配置 WECHAT_APPID 和 WECHAT_SECRET
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">文章管理</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 font-medium">文章列表</h2>
          <div className="space-y-2">
            {articles.length === 0 ? (
              <div className="text-muted-foreground">暂无文章</div>
            ) : (
              articles.map((article, i) => (
                <div
                  key={i}
                  onClick={() => loadArticleContent(article)}
                  className={`cursor-pointer rounded p-3 hover:bg-muted ${selectedArticle?.slug === article.slug ? "border bg-muted" : ""}`}
                >
                  <div className="font-medium">{article.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {article.date} · {article.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-4 font-medium">发布操作</h2>
          {selectedArticle ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">标题</div>
                <div className="font-medium">{selectedArticle.title}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  className="rounded border px-4 py-2 hover:bg-muted"
                >
                  预览
                </button>
                <button
                  onClick={handleCopyWechatFormat}
                  disabled={loading}
                  className="rounded border px-4 py-2 hover:bg-muted disabled:opacity-50"
                >
                  复制微信格式
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
                >
                  {loading ? "发布中..." : "发布到草稿箱"}
                </button>
              </div>
              {message && (
                <div
                  className={`rounded p-3 ${message.includes("成功") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message}
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">请选择一篇文章</div>
          )}
        </div>
      </div>
    </div>
  )
}
