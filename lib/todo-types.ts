export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskView = "day" | "week" | "month"

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  startAt: string | null
  dueAt: string | null
  allDay: boolean
  tags: string[]
  subtasks: Subtask[]
  reminderAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  startAt?: string | null
  dueAt?: string | null
  allDay?: boolean
  tags?: string[]
  subtasks?: Subtask[]
  reminderAt?: string | null
}

export interface TaskStats {
  total: number
  todo: number
  inProgress: number
  done: number
  overdue: number
  today: number
  thisWeek: number
}

export const STATUS_META: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  todo: { label: "待办", color: "text-slate-700", bg: "bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
  in_progress: { label: "进行中", color: "text-blue-700", bg: "bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300" },
  done: { label: "已完成", color: "text-green-700", bg: "bg-green-100 dark:bg-green-900/40 dark:text-green-300" },
}

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; color: string; barColor: string; ringColor: string }
> = {
  low: {
    label: "低",
    color: "text-slate-600",
    barColor: "bg-slate-400",
    ringColor: "ring-slate-300",
  },
  medium: {
    label: "中",
    color: "text-blue-600",
    barColor: "bg-blue-500",
    ringColor: "ring-blue-300",
  },
  high: {
    label: "高",
    color: "text-orange-600",
    barColor: "bg-orange-500",
    ringColor: "ring-orange-300",
  },
  urgent: {
    label: "紧急",
    color: "text-red-600",
    barColor: "bg-red-500",
    ringColor: "ring-red-300",
  },
}

export const VIEW_META: Record<TaskView, { label: string }> = {
  day: { label: "日" },
  week: { label: "周" },
  month: { label: "月" },
}
