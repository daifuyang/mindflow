import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTokenFromRequest, verifyTokenFromHeaders } from "@/lib/auth"
import { taskFromApi, taskInputToCreate } from "@/lib/todo-utils"
import type { TaskInput } from "@/lib/todo-types"

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (await verifyTokenFromRequest(request)) return true
  return verifyTokenFromHeaders(request)
}

export async function GET(request: NextRequest) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const start = searchParams.get("start")
  const end = searchParams.get("end")
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")
  const q = searchParams.get("q")

  const where: Record<string, unknown> = {}
  if (start || end) {
    const range: Record<string, Date> = {}
    if (start) range.gte = new Date(start)
    if (end) range.lte = new Date(end)
    where.OR = [
      { dueAt: range },
      { startAt: range },
      {
        AND: [
          { startAt: { lte: new Date(end ?? start ?? new Date()) } },
          { dueAt: { gte: new Date(start ?? end ?? new Date()) } },
        ],
      },
    ]
  }
  if (status && status !== "all") where.status = status
  if (priority && priority !== "all") where.priority = priority
  if (q) where.title = { contains: q }

  const records = await prisma.task.findMany({
    where,
    orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
  })

  return NextResponse.json(records.map(taskFromApi))
}

export async function POST(request: NextRequest) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  let body: TaskInput
  try {
    body = (await request.json()) as TaskInput
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 })
  }

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 })
  }

  const data = taskInputToCreate(body)
  const record = await prisma.task.create({ data })
  return NextResponse.json(taskFromApi(record), { status: 201 })
}
