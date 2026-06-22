"use client"

import { TaskCard } from "./todo-task-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Task } from "@/lib/todo-types"
import { sortTasks } from "@/lib/todo-utils"

interface TaskListProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskToggle?: (task: Task) => void
  emptyText?: string
  showStatus?: boolean
  height?: string
}

export function TaskList({
  tasks,
  onTaskClick,
  onTaskToggle,
  emptyText = "暂无任务",
  showStatus = true,
  height = "h-full",
}: TaskListProps) {
  const sorted = sortTasks(tasks)

  if (sorted.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        {emptyText}
      </div>
    )
  }

  return (
    <ScrollArea className={height}>
      <div className="space-y-1.5 p-1">
        {sorted.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick?.(task)}
            onToggle={() => onTaskToggle?.(task)}
            showStatus={showStatus}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
