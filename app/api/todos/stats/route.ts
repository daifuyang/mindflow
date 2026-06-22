import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTokenFromHeaders, verifyTokenFromRequest } from "@/lib/auth"
import { computeStats, taskFromApi } from "@/lib/todo-utils"

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (await verifyTokenFromRequest(request)) return true
  return verifyTokenFromHeaders(request)
}

export async function GET(request: NextRequest) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  const records = await prisma.task.findMany()
  const tasks = records.map(taskFromApi)
  return NextResponse.json(computeStats(tasks))
}
