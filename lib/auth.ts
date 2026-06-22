import crypto from "crypto"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me"

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

export async function verifyTokenFromCookies(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return false
  const result = verifyToken(token)
  return result.valid
}

export async function verifyTokenFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_token")?.value
  if (!token) return false
  const result = verifyToken(token)
  return result.valid
}

export function verifyTokenFromHeaders(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return false
  const token = authHeader.slice(7)
  const result = verifyToken(token)
  return result.valid
}

export function generateToken(payload: object): string {
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
