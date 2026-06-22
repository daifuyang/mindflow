import { cn } from "@/lib/utils"
import { PRIORITY_META, type TaskPriority } from "@/lib/todo-types"

interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const meta = PRIORITY_META[priority]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        meta.color,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.barColor)} />
      {meta.label}
    </span>
  )
}
