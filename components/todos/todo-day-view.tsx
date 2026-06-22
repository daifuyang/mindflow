"use client"

import { useMemo } from "react"
import { format, isSameDay, isToday } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { fmtTime, isOverdue } from "@/lib/todo-utils"
import { PriorityBadge } from "./todo-priority-badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/lib/todo-types"

interface DayViewProps {
  date: Date
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskToggle: (task: Task) => void
  onSlotClick?: (hour: number) => void
}

const HOUR_HEIGHT = 48
const START_HOUR = 6
const END_HOUR = 23

export function DayView({ date, tasks, onTaskClick, onTaskToggle, onSlotClick }: DayViewProps) {
  const hours = useMemo(
    () => Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR),
    []
  )

  const allDayTasks = tasks.filter((t) => t.allDay)
  const timedTasks = tasks.filter((t) => !t.allDay)

  const getTaskPosition = (task: Task) => {
    if (!task.startAt || !task.dueAt) return null
    const start = new Date(task.startAt)
    const end = new Date(task.dueAt)
    if (!isSameDay(start, date)) return null
    const startHour = start.getHours() + start.getMinutes() / 60
    const endHour = end.getHours() + end.getMinutes() / 60
    const top = (startHour - START_HOUR) * HOUR_HEIGHT
    const height = Math.max(28, (endHour - startHour) * HOUR_HEIGHT)
    return { top, height }
  }

  const tasksWithoutTime = timedTasks.filter((t) => {
    if (!t.dueAt) return true
    if (isSameDay(new Date(t.dueAt), date)) {
      if (!t.startAt) return true
      return isSameDay(new Date(t.startAt), date)
    }
    return false
  }).filter((t) => !t.startAt || !isSameDay(new Date(t.startAt), date))

  const tasksWithTimeInDay = timedTasks.filter((t) => {
    if (!t.startAt) return false
    if (!isSameDay(new Date(t.startAt), date)) return false
    if (!t.dueAt) return false
    return isSameDay(new Date(t.dueAt), date)
  })

  const overdue = isToday(date) ? tasksWithoutTime.filter(isOverdue) : []

  return (
    <div className="border-border/60 bg-card flex h-full flex-col overflow-hidden rounded-lg border">
      <div className="border-border/60 bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div>
          <div className="text-base font-semibold">
            {format(date, "M月d日 EEEE", { locale: zhCN })}
          </div>
          {isToday(date) && <div className="text-muted-foreground text-xs">今天</div>}
        </div>
        <div className="text-muted-foreground text-xs">
          {tasks.length} 个任务
        </div>
      </div>

      {allDayTasks.length > 0 && (
        <div className="border-border/60 bg-muted/20 border-b p-2">
          <div className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">
            全天
          </div>
          <div className="space-y-1">
            {allDayTasks.map((t) => (
              <DayTaskRow
                key={t.id}
                task={t}
                onClick={() => onTaskClick(t)}
                onToggle={() => onTaskToggle(t)}
                isAllDay
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-y-auto">
        <div
          className="relative"
          style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}
        >
          {hours.map((h) => (
            <div
              key={h}
              className="border-border/40 hover:bg-muted/30 relative border-t"
              style={{ height: HOUR_HEIGHT }}
              onClick={() => onSlotClick?.(h)}
            >
              <div className="text-muted-foreground absolute -top-2 left-2 bg-card px-1 text-[10px]">
                {String(h).padStart(2, "0")}:00
              </div>
            </div>
          ))}

          {tasksWithTimeInDay.map((task) => {
            const pos = getTaskPosition(task)
            if (!pos) return null
            const overdueClass = isOverdue(task)
            return (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={cn(
                  "absolute left-14 right-2 rounded-md border-l-4 px-2 py-1 text-left text-xs transition-colors",
                  "bg-primary/10 hover:bg-primary/20 border-primary",
                  task.status === "done" && "opacity-60",
                  overdueClass && "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                )}
                style={{
                  top: pos.top + 4,
                  height: pos.height - 4,
                }}
              >
                <div className="line-clamp-1 font-medium">{task.title}</div>
                <div className="text-muted-foreground mt-0.5 text-[10px]">
                  {fmtTime(task.startAt)} - {fmtTime(task.dueAt)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {(tasksWithoutTime.length > 0 || overdue.length > 0) && (
        <div className="border-border/60 bg-muted/20 max-h-48 shrink-0 overflow-y-auto border-t p-2">
          <div className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">
            {isToday(date) && overdue.length > 0 ? "已逾期" : "其他任务"}
          </div>
          <div className="space-y-1">
            {tasksWithoutTime.map((t) => (
              <DayTaskRow
                key={t.id}
                task={t}
                onClick={() => onTaskClick(t)}
                onToggle={() => onTaskToggle(t)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface DayTaskRowProps {
  task: Task
  onClick: () => void
  onToggle: () => void
  isAllDay?: boolean
}

function DayTaskRow({ task, onClick, onToggle, isAllDay }: DayTaskRowProps) {
  const overdue = isOverdue(task)
  return (
    <div
      className={cn(
        "hover:bg-accent/40 flex items-center gap-2 rounded-md border px-2 py-1.5",
        task.status === "done" && "opacity-60"
      )}
    >
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={onToggle}
      />
      <div className="flex-1 cursor-pointer" onClick={onClick}>
        <div
          className={cn(
            "text-sm",
            task.status === "done" && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </div>
        {!isAllDay && task.dueAt && (
          <div
            className={cn(
              "text-[10px]",
              overdue ? "text-red-600" : "text-muted-foreground"
            )}
          >
            {fmtTime(task.dueAt)}
          </div>
        )}
      </div>
      <PriorityBadge priority={task.priority} />
    </div>
  )
}
