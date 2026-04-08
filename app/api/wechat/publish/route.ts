import { NextResponse } from "next/server"
import { markdownToWeChatHTML } from "@/lib/wechat"

const WECHAT_APPID = process.env.WECHAT_APPID
const WECHAT_SECRET = process.env.WECHAT_SECRET

let cachedToken: { token: string; expires: number } | null = null

async function getAccessToken(): Promise<string | null> {
  if (!WECHAT_APPID || !WECHAT_SECRET) return null
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token

  try {
    const res = await fetch(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}`
    )
    const data = await res.json()
    if (data.access_token) {
      cachedToken = {
        token: data.access_token,
        expires: Date.now() + (data.expires_in - 300) * 1000,
      }
      return data.access_token
    }
    return null
  } catch {
    return null
  }
}

function verifyToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false
  // 简化验证，生产环境应校验JWT
  return authHeader.slice(7).length > 0
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!verifyToken(authHeader)) {
    return NextResponse.json(
      { success: false, message: "未登录或登录已过期" },
      { status: 401 }
    )
  }

  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { success: false, message: "微信未配置或获取Token失败" },
      { status: 500 }
    )
  }

  const { title, content, coverImage, author, digest } = await request.json()
  const htmlContent = markdownToWeChatHTML(content)

  const articles = [
    {
      title: title || "无标题",
      author: author || "富阳说",
      content: htmlContent,
      content_source_url: "",
      digest: digest || content.slice(0, 120) + "...",
      show_cover_pic: coverImage ? 1 : 0,
      thumb_media_id: "",
    },
  ]

  try {
    const res = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles }),
      }
    )
    const data = await res.json()

    if (data.media_id) {
      return NextResponse.json({
        success: true,
        mediaId: data.media_id,
        message: "已保存到草稿箱",
      })
    }

    return NextResponse.json(
      { success: false, message: data.errmsg || "上传失败" },
      { status: 500 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "请求失败" },
      { status: 500 }
    )
  }
}
