import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { zhCN } from "date-fns/locale"
import type { Subtask, Task, TaskInput, TaskPriority, TaskStats, TaskStatus, TaskView } from "./todo-types"

const DATE_FMT = "yyyy-MM-dd"
const DATETIME_FMT = "yyyy-MM-dd'T'HH:mm"

export function fmtDate(date: Date | string | null | undefined, pattern = DATE_FMT): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return ""
  return format(d, pattern, { locale: zhCN })
}

export function fmtTime(date: Date | string | null | undefined): string {
  if (!date) return ""
  return fmtDate(date, "HH:mm")
}

export function fmtMonth(date: Date): string {
  return format(date, "yyyy 年 M 月", { locale: zhCN })
}

export function fmtDayHeader(date: Date): string {
  return format(date, "M月d日 EEEE", { locale: zhCN })
}

export function toDateInputLocal(value: string | Date | null | undefined): string {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  if (isNaN(d.getTime())) return ""
  return format(d, DATETIME_FMT)
}

export function fromDateInputLocal(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

export function weekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1, locale: zhCN }),
    end: endOfWeek(date, { weekStartsOn: 1, locale: zhCN }),
  }
}

export function monthRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function dayRange(date: Date): { start: Date; end: Date } {
  const s = startOfDay(date)
  return { start: s, end: addDays(s, 1) }
}

export function getRangeForView(view: TaskView, date: Date): { start: Date; end: Date } {
  if (view === "day") return dayRange(date)
  if (view === "week") return weekRange(date)
  return monthRange(date)
}

export function getGridDates(view: TaskView, date: Date): Date[] {
  if (view === "day") return [startOfDay(date)]
  if (view === "week") {
    const { start, end } = weekRange(date)
    const days: Date[] = []
    for (let d = start; d <= end; d = addDays(d, 1)) days.push(d)
    return days
  }
  const monthStart = startOfMonth(date)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const days: Date[] = []
  for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i))
  return days
}

export function navigateDate(view: TaskView, date: Date, direction: 1 | -1): Date {
  if (view === "day") return addDays(date, direction)
  if (view === "week") return addDays(date, direction * 7)
  return direction === 1 ? addMonths(date, 1) : subMonths(date, 1)
}

export function getHeaderLabel(view: TaskView, date: Date): string {
  if (view === "day") return format(date, "yyyy年M月d日 EEEE", { locale: zhCN })
  if (view === "week") {
    const { start, end } = weekRange(date)
    return `${format(start, "M月d日", { locale: zhCN })} - ${format(end, "M月d日", { locale: zhCN })}`
  }
  return fmtMonth(date)
}

export function isOverdue(task: Task): boolean {
  if (task.status === "done") return false
  if (!task.dueAt) return false
  return isBefore(new Date(task.dueAt), new Date())
}

export function isTodayTask(task: Task): boolean {
  if (!task.dueAt) return false
  return isSameDay(new Date(task.dueAt), new Date())
}

export function isThisWeekTask(task: Task): boolean {
  if (!task.dueAt) return false
  const d = new Date(task.dueAt)
  const { start, end } = weekRange(new Date())
  return d >= start && d <= end
}

export function taskOnDate(task: Task, date: Date): boolean {
  const target = startOfDay(date)
  const due = task.dueAt ? new Date(task.dueAt) : null
  const start = task.startAt ? new Date(task.startAt) : null
  if (due && isSameDay(due, date)) return true
  if (start && isSameDay(start, date)) return true
  if (start && due) {
    const s = startOfDay(start)
    const e = startOfDay(due)
    return target >= s && target <= e
  }
  return false
}

export function groupTasksByDay(tasks: Task[], dates: Date[]): Record<string, Task[]> {
  const map: Record<string, Task[]> = {}
  for (const d of dates) {
    map[startOfDay(d).toISOString()] = []
  }
  for (const task of tasks) {
    for (const d of dates) {
      if (taskOnDate(task, d)) {
        const key = startOfDay(d).toISOString()
        map[key].push(task)
        break
      }
    }
  }
  return map
}

export function parseSubtasks(json: string | null | undefined): Subtask[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return []
    return arr.filter(
      (s): s is Subtask =>
        typeof s === "object" &&
        s !== null &&
        typeof s.id === "string" &&
        typeof s.title === "string" &&
        typeof s.done === "boolean"
    )
  } catch {
    return []
  }
}

export function serializeSubtasks(subs: Subtask[]): string {
  return JSON.stringify(subs)
}

export function parseTags(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return []
    return arr.filter((s): s is string => typeof s === "string")
  } catch {
    return []
  }
}

export function serializeTags(tags: string[]): string {
  return JSON.stringify(tags)
}

export function taskFromApi(record: {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  startAt: Date | null
  dueAt: Date | null
  allDay: boolean
  tags: string | null
  subtasks: string | null
  reminderAt: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}): Task {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    status: (record.status as TaskStatus) ?? "todo",
    priority: (record.priority as TaskPriority) ?? "medium",
    startAt: record.startAt ? record.startAt.toISOString() : null,
    dueAt: record.dueAt ? record.dueAt.toISOString() : null,
    allDay: record.allDay,
    tags: parseTags(record.tags),
    subtasks: parseSubtasks(record.subtasks),
    reminderAt: record.reminderAt ? record.reminderAt.toISOString() : null,
    completedAt: record.completedAt ? record.completedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

export function taskInputToCreate(input: TaskInput) {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    startAt: input.startAt ? new Date(input.startAt) : null,
    dueAt: input.dueAt ? new Date(input.dueAt) : null,
    allDay: input.allDay ?? false,
    tags: input.tags && input.tags.length > 0 ? serializeTags(input.tags) : null,
    subtasks:
      input.subtasks && input.subtasks.length > 0
        ? serializeSubtasks(input.subtasks)
        : null,
    reminderAt: input.reminderAt ? new Date(input.reminderAt) : null,
  }
}

export function taskInputToUpdate(input: Partial<TaskInput>) {
  const data: Record<string, unknown> = {}
  if (input.title !== undefined) data.title = input.title.trim()
  if (input.description !== undefined) data.description = input.description?.trim() || null
  if (input.status !== undefined) data.status = input.status
  if (input.priority !== undefined) data.priority = input.priority
  if (input.startAt !== undefined)
    data.startAt = input.startAt ? new Date(input.startAt) : null
  if (input.dueAt !== undefined)
    data.dueAt = input.dueAt ? new Date(input.dueAt) : null
  if (input.allDay !== undefined) data.allDay = input.allDay
  if (input.tags !== undefined) {
    data.tags = input.tags.length > 0 ? serializeTags(input.tags) : null
  }
  if (input.subtasks !== undefined) {
    data.subtasks =
      input.subtasks.length > 0 ? serializeSubtasks(input.subtasks) : null
  }
  if (input.reminderAt !== undefined) {
    data.reminderAt = input.reminderAt ? new Date(input.reminderAt) : null
  }
  return data
}

export function computeStats(tasks: Task[]): TaskStats {
  const stats: TaskStats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
    today: 0,
    thisWeek: 0,
  }
  for (const t of tasks) {
    if (t.status === "todo") stats.todo++
    else if (t.status === "in_progress") stats.inProgress++
    else if (t.status === "done") stats.done++
    if (isOverdue(t)) stats.overdue++
    if (isTodayTask(t)) stats.today++
    if (isThisWeekTask(t)) stats.thisWeek++
  }
  return stats
}

export function isInMonth(date: Date, monthDate: Date): boolean {
  return isSameMonth(date, monthDate)
}

export function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function priorityRank(p: TaskPriority): number {
  return { low: 0, medium: 1, high: 2, urgent: 3 }[p]
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1
    if (a.status !== "done" && b.status === "done") return -1
    const pa = priorityRank(a.priority)
    const pb = priorityRank(b.priority)
    if (pa !== pb) return pb - pa
    const da = a.dueAt ? new Date(a.dueAt).getTime() : Number.POSITIVE_INFINITY
    const db = b.dueAt ? new Date(b.dueAt).getTime() : Number.POSITIVE_INFINITY
    return da - db
  })
}

export function filterByStatus(tasks: Task[], status: TaskStatus | "all"): Task[] {
  if (status === "all") return tasks
  return tasks.filter((t) => t.status === status)
}

export function filterByPriority(
  tasks: Task[],
  priority: TaskPriority | "all"
): Task[] {
  if (priority === "all") return tasks
  return tasks.filter((t) => t.priority === priority)
}

export function filterBySearch(tasks: Task[], q: string): Task[] {
  const term = q.trim().toLowerCase()
  if (!term) return tasks
  return tasks.filter((t) => {
    if (t.title.toLowerCase().includes(term)) return true
    if (t.description && t.description.toLowerCase().includes(term)) return true
    if (t.tags.some((tag) => tag.toLowerCase().includes(term))) return true
    return false
  })
}
