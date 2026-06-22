"use client"

import { useMemo } from "react"
import { addDays, format, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns"
import { cn } from "@/lib/utils"
import { isOverdue, taskOnDate } from "@/lib/todo-utils"
import type { Task } from "@/lib/todo-types"
import { PRIORITY_META } from "@/lib/todo-types"

interface MonthViewProps {
  date: Date
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onDayClick: (date: Date) => void
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

export function MonthView({ date, tasks, onTaskClick, onDayClick }: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(date)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  }, [date])

  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const d of days) {
      const k = d.toISOString()
      map[k] = tasks.filter((t) => taskOnDate(t, d))
    }
    return map
  }, [days, tasks])

  return (
    <div className="border-border/60 bg-card flex h-full flex-col overflow-hidden rounded-lg border">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="border-border/40 text-muted-foreground border-l px-2 py-1.5 text-center text-xs font-medium first:border-l-0"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 grid-rows-6 overflow-hidden">
        {days.map((d) => {
          const k = d.toISOString()
          const dayTasks = tasksByDay[k] ?? []
          const inMonth = isSameMonth(d, date)
          const today = isToday(d)
          return (
            <div
              key={k}
              onClick={() => onDayClick(d)}
              className={cn(
                "border-border/40 hover:bg-muted/20 group flex min-h-0 cursor-pointer flex-col gap-0.5 border-l border-t p-1.5 first:border-l-0",
                !inMonth && "bg-muted/20 opacity-50"
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium",
                  today &&
                    "bg-primary text-primary-foreground inline-flex size-5 items-center justify-center rounded-full"
                )}
              >
                {format(d, "d")}
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                {dayTasks.slice(0, 3).map((t) => (
                  <MonthTaskChip
                    key={t.id}
                    task={t}
                    onClick={() => onTaskClick(t)}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-muted-foreground px-1 text-[10px]">
                    +{dayTasks.length - 3}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface MonthTaskChipProps {
  task: Task
  onClick: () => void
}

function MonthTaskChip({ task, onClick }: MonthTaskChipProps) {
  const overdue = isOverdue(task)
  const priorityMeta = PRIORITY_META[task.priority]
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "hover:bg-accent/50 group flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-[10px]",
        task.status === "done" && "opacity-60"
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          priorityMeta.barColor,
          task.status === "done" && "opacity-40"
        )}
      />
      <span
        className={cn(
          "truncate",
          task.status === "done" && "line-through text-muted-foreground",
          overdue && !task.status.includes("done") && "text-red-600 dark:text-red-400"
        )}
      >
        {task.title}
      </span>
    </div>
  )
}
