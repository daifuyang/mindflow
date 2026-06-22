"use client"

import { useMemo } from "react"
import { addDays, format, isToday, startOfDay } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { fmtTime, isOverdue, taskOnDate } from "@/lib/todo-utils"
import { PriorityBadge } from "./todo-priority-badge"
import type { Task } from "@/lib/todo-types"

interface WeekViewProps {
  date: Date
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskToggle: (task: Task) => void
  onDayClick: (date: Date) => void
}

export function WeekView({ date, tasks, onTaskClick, onTaskToggle, onDayClick }: WeekViewProps) {
  const days = useMemo(() => {
    const start = startOfDay(date)
    const ws = new Date(start)
    const dow = ws.getDay() || 7
    ws.setDate(ws.getDate() - (dow - 1))
    return Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  }, [date])

  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const d of days) {
      const k = startOfDay(d).toISOString()
      map[k] = tasks.filter((t) => taskOnDate(t, d))
    }
    return map
  }, [days, tasks])

  return (
    <div className="border-border/60 bg-card flex h-full flex-col overflow-hidden rounded-lg border">
      <div className="grid grid-cols-7 border-b">
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={cn(
              "border-border/40 px-2 py-2 text-center text-xs font-medium border-l first:border-l-0",
              isToday(d) && "bg-primary/5 text-primary"
            )}
          >
            <div className="text-muted-foreground text-[10px]">
              {format(d, "EEE", { locale: zhCN })}
            </div>
            <div className="text-base font-semibold">{format(d, "d")}</div>
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 overflow-hidden">
        {days.map((d) => {
          const k = startOfDay(d).toISOString()
          const dayTasks = tasksByDay[k] ?? []
          return (
            <div
              key={k}
              className="border-border/40 hover:bg-muted/20 flex min-h-0 cursor-pointer flex-col gap-1 border-l p-1.5 first:border-l-0"
              onClick={() => onDayClick(d)}
            >
              {dayTasks.length === 0 ? (
                <div className="text-muted-foreground/40 py-4 text-center text-[10px]">无</div>
              ) : (
                dayTasks.slice(0, 5).map((t) => (
                  <WeekTaskChip
                    key={t.id}
                    task={t}
                    onClick={() => onTaskClick(t)}
                    onToggle={() => onTaskToggle(t)}
                  />
                ))
              )}
              {dayTasks.length > 5 && (
                <div className="text-muted-foreground text-center text-[10px]">
                  +{dayTasks.length - 5}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface WeekTaskChipProps {
  task: Task
  onClick: () => void
  onToggle: () => void
}

function WeekTaskChip({ task, onClick, onToggle }: WeekTaskChipProps) {
  const overdue = isOverdue(task)
  const due = task.dueAt ? new Date(task.dueAt) : null
  const hasTime = due && !task.allDay
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "bg-card hover:bg-accent/50 group flex items-center gap-1 rounded border px-1.5 py-1 text-[11px]",
        overdue && "border-red-300 bg-red-50 dark:bg-red-900/20",
        task.status === "done" && "opacity-60"
      )}
    >
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={onToggle}
        className="size-3"
      />
      <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
        <div
          className={cn(
            "truncate font-medium",
            task.status === "done" && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
          {hasTime && <span>{fmtTime(task.dueAt)}</span>}
          <PriorityBadge priority={task.priority} className="!text-[9px] !px-1 !py-0" />
        </div>
      </div>
    </div>
  )
}
