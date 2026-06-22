"use client"

import { useCallback, useEffect, useState } from "react"
import type { Task, TaskInput, TaskStats, TaskView } from "@/lib/todo-types"
import { getRangeForView } from "@/lib/todo-utils"

export function useTodos(view: TaskView, currentDate: Date) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const { start, end } = getRangeForView(view, currentDate)
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      })
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`/api/todos?${params}`, { headers })
      if (res.ok) {
        const data = (await res.json()) as Task[]
        setTasks(data)
      }
    } finally {
      setLoading(false)
    }
  }, [view, currentDate])

  const fetchStats = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch("/api/todos/stats", { headers })
    if (res.ok) {
      const data = (await res.json()) as TaskStats
      setStats(data)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const createTask = useCallback(
    async (input: TaskInput) => {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error || "创建失败")
      }
      const created = (await res.json()) as Task
      setTasks((prev) => [...prev, created])
      fetchStats()
      return created
    },
    [fetchStats]
  )

  const updateTask = useCallback(
    async (id: string, input: Partial<TaskInput>) => {
      const token = localStorage.getItem("admin_token")
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error || "更新失败")
      }
      const updated = (await res.json()) as Task
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      fetchStats()
      return updated
    },
    [fetchStats]
  )

  const toggleStatus = useCallback(
    async (task: Task) => {
      const next = task.status === "done" ? "todo" : "done"
      await updateTask(task.id, { status: next })
    },
    [updateTask]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const token = localStorage.getItem("admin_token")
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error("删除失败")
      }
      setTasks((prev) => prev.filter((t) => t.id !== id))
      fetchStats()
    },
    [fetchStats]
  )

  return {
    tasks,
    stats,
    loading,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
    refresh: () => {
      fetchTasks()
      fetchStats()
    },
  }
}
