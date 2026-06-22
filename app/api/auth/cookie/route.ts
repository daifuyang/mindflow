import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  })

  return response
}
