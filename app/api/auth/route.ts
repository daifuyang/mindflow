import { NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD_HASH_BASE64 = process.env.ADMIN_PASSWORD_HASH || ""
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me"

function getPasswordHash(): string {
  if (!ADMIN_PASSWORD_HASH_BASE64) return ""
  try {
    return Buffer.from(ADMIN_PASSWORD_HASH_BASE64, "base64").toString()
  } catch {
    return ""
  }
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(password, storedHash)
}

function generateToken(payload: object): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url")
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payloadB64}`)
    .digest("base64url")
  return `${header}.${payloadB64}.${signature}`
}

function verifyToken(token: string): { valid: boolean; payload?: object } {
  try {
    const [header, payloadB64, signature] = token.split(".")
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payloadB64}`)
      .digest("base64url")
    if (signature !== expectedSig) return { valid: false }
    return {
      valid: true,
      payload: JSON.parse(Buffer.from(payloadB64, "base64url").toString()),
    }
  } catch {
    return { valid: false }
  }
}

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const ADMIN_PASSWORD_HASH = getPasswordHash()

  const passwordValid =
    username === ADMIN_USERNAME &&
    ADMIN_PASSWORD_HASH &&
    (await verifyPassword(password, ADMIN_PASSWORD_HASH))

  if (passwordValid) {
    const token = generateToken({
      username,
      role: "admin",
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
    return NextResponse.json({ success: true, token })
  }

  return NextResponse.json(
    { success: false, message: "用户名或密码错误" },
    { status: 401 }
  )
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ authenticated: false })
  }

  const token = authHeader.slice(7)
  const result = verifyToken(token)
  if (!result.valid || !result.payload) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({ authenticated: true, user: result.payload })
}
