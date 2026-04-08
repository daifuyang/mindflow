import { NextResponse } from "next/server"

const WECHAT_APPID = process.env.WECHAT_APPID
const WECHAT_SECRET = process.env.WECHAT_SECRET

let cachedToken: { token: string; expires: number } | null = null

async function getAccessToken(): Promise<string | null> {
  if (!WECHAT_APPID || !WECHAT_SECRET) {
    return null
  }

  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token
  }

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

export async function GET() {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { configured: false, message: "微信未配置或获取Token失败" },
      { status: 500 }
    )
  }
  return NextResponse.json({ configured: true })
}
