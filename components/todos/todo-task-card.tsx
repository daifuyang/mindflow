"use client"

import { CheckCircle2, Circle, Clock, Tag as TagIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { PriorityBadge } from "./todo-priority-badge"
import { StatusBadge } from "./todo-status-badge"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/todo-types"
import { fmtDate, isOverdue } from "@/lib/todo-utils"

interface TaskCardProps {
  task: Task
  onClick?: () => void
  onToggle?: () => void
  compact?: boolean
  showStatus?: boolean
}

export function TaskCard({
  task,
  onClick,
  onToggle,
  compact = false,
  showStatus = false,
}: TaskCardProps) {
  const overdue = isOverdue(task)
  const hasSubtasks = task.subtasks.length > 0
  const completedSubs = task.subtasks.filter((s) => s.done).length

  return (
    <div
      className={cn(
        "group bg-card hover:bg-accent/40 border-border/60 relative flex gap-2 rounded-lg border p-2.5 transition-colors",
        task.status === "done" && "opacity-60"
      )}
    >
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggle?.()
        }}
        className="flex shrink-0 items-start pt-0.5"
      >
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={() => onToggle?.()}
        />
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium leading-tight",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h4>
        </div>

        {!compact && task.description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
            {task.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {showStatus && <StatusBadge status={task.status} />}

          {task.dueAt && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px]",
                overdue
                  ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {task.status === "done" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <Clock className="size-3" />
              )}
              {fmtDate(task.dueAt, compact ? "M-d" : "M-d HH:mm")}
            </span>
          )}

          {hasSubtasks && (
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px]">
              <Circle className="size-3" />
              {completedSubs}/{task.subtasks.length}
            </span>
          )}

          {task.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px]"
            >
              <TagIcon className="size-2.5" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
