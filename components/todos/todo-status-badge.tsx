import { cn } from "@/lib/utils"
import { STATUS_META, type TaskStatus } from "@/lib/todo-types"

interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        meta.bg,
        meta.color,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
