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

async function uploadImageToWeChat(
  token: string,
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const form = new FormData()
    form.append("media", new Blob([buffer]), "cover.jpg")

    const res = await fetch(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
      { method: "POST", body: buffer as unknown as BodyInit }
    )
    const data = await res.json()
    return data.media_id || null
  } catch {
    return null
  }
}

function verifyToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false
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

  const { title, content, author, digest, coverImage } = await request.json()
  const htmlContent = markdownToWeChatHTML(content)

  let thumbMediaId: string | undefined
  if (coverImage) {
    const mediaId = await uploadImageToWeChat(token, coverImage)
    thumbMediaId = mediaId || undefined
  }

  const articles = [
    {
      title: title || "无标题",
      author: author || "富阳说",
      content: htmlContent,
      content_source_url: "",
      digest: digest || content.slice(0, 120) + "...",
      ...(thumbMediaId && { thumb_media_id: thumbMediaId, show_cover_pic: 1 }),
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
  } catch {
    return NextResponse.json(
      { success: false, message: "请求失败" },
      { status: 500 }
    )
  }
}
