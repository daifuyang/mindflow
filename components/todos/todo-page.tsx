"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { TodoToolbar } from "./todo-toolbar"
import { DayView } from "./todo-day-view"
import { WeekView } from "./todo-week-view"
import { MonthView } from "./todo-month-view"
import { TaskDialog } from "./todo-task-dialog"
import { TaskList } from "./todo-task-list"
import { StatsCards } from "./todo-stats-cards"
import { useTodos } from "./use-todos"
import {
  filterByPriority,
  filterBySearch,
  filterByStatus,
  navigateDate,
} from "@/lib/todo-utils"
import type { Task, TaskPriority, TaskStatus, TaskView } from "@/lib/todo-types"

export function TodoPage() {
  const router = useRouter()
  const [view, setView] = useState<TaskView>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [createDefaultDate, setCreateDefaultDate] = useState<Date | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/login?redirect=/admin/todos")
      return
    }
    fetch("/api/auth", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) router.push("/login?redirect=/admin/todos")
      })
      .catch(() => router.push("/login?redirect=/admin/todos"))
  }, [router])

  const { tasks, stats, createTask, updateTask, toggleStatus, deleteTask } = useTodos(
    view,
    currentDate
  )

  const filteredTasks = useMemo(() => {
    return filterBySearch(filterByPriority(filterByStatus(tasks, statusFilter), priorityFilter), search)
  }, [tasks, statusFilter, priorityFilter, search])

  const handlePrev = () => setCurrentDate((d) => navigateDate(view, d, -1))
  const handleNext = () => setCurrentDate((d) => navigateDate(view, d, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleCreate = () => {
    setEditingTask(null)
    setCreateDefaultDate(currentDate)
    setDialogOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setCreateDefaultDate(null)
    setDialogOpen(true)
  }

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setView("day")
  }

  const handleSubmit = async (input: Parameters<typeof createTask>[0]) => {
    if (editingTask) {
      await updateTask(editingTask.id, input)
    } else {
      await createTask(input)
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col gap-3 p-3 md:p-4">
      <TodoToolbar
        view={view}
        currentDate={currentDate}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onCreate={handleCreate}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      <StatsCards stats={stats} />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
        <div className="min-h-0">
          {view === "day" && (
            <DayView
              date={currentDate}
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskToggle={toggleStatus}
              onSlotClick={(h) => {
                const d = new Date(currentDate)
                d.setHours(h, 0, 0, 0)
                setCreateDefaultDate(d)
                setEditingTask(null)
                setDialogOpen(true)
              }}
            />
          )}
          {view === "week" && (
            <WeekView
              date={currentDate}
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskToggle={toggleStatus}
              onDayClick={handleDayClick}
            />
          )}
          {view === "month" && (
            <MonthView
              date={currentDate}
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onDayClick={handleDayClick}
            />
          )}
        </div>
        <div className="border-border/60 bg-card flex min-h-0 flex-col overflow-hidden rounded-lg border">
          <div className="border-border/60 flex items-center justify-between border-b px-3 py-2">
            <h3 className="text-sm font-semibold">任务列表</h3>
            <span className="text-muted-foreground text-xs">{filteredTasks.length}</span>
          </div>
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskToggle={toggleStatus}
            height="h-full"
          />
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultDate={createDefaultDate}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
      />
    </div>
  )
}
