import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTokenFromHeaders, verifyTokenFromRequest } from "@/lib/auth"
import { taskFromApi, taskInputToUpdate } from "@/lib/todo-utils"
import type { TaskInput } from "@/lib/todo-types"

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (await verifyTokenFromRequest(request)) return true
  return verifyTokenFromHeaders(request)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  const { id } = await params
  const record = await prisma.task.findUnique({ where: { id } })
  if (!record) return NextResponse.json({ error: "任务不存在" }, { status: 404 })
  return NextResponse.json(taskFromApi(record))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  const { id } = await params
  let body: Partial<TaskInput>
  try {
    body = (await request.json()) as Partial<TaskInput>
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 })
  }

  const data = taskInputToUpdate(body)
  if (body.status === "done") {
    data.completedAt = new Date()
  } else if (body.status) {
    data.completedAt = null
  }

  try {
    const record = await prisma.task.update({ where: { id }, data })
    return NextResponse.json(taskFromApi(record))
  } catch {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAuthorized(request)
  if (!ok) return NextResponse.json({ error: "未授权" }, { status: 401 })

  const { id } = await params
  try {
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 })
  }
}
