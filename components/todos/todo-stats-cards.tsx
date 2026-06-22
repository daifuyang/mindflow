"use client"

import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskStats } from "@/lib/todo-types"

interface StatsCardsProps {
  stats: TaskStats | null
}

interface CardItem {
  label: string
  value: number
  icon: React.ReactNode
  className?: string
}

export function StatsCards({ stats }: StatsCardsProps) {
  const s = stats ?? { total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0, today: 0, thisWeek: 0 }

  const items: CardItem[] = [
    { label: "今日待办", value: s.today, icon: <Clock className="size-4" />, className: "text-blue-600" },
    { label: "逾期", value: s.overdue, icon: <AlertCircle className="size-4" />, className: "text-red-600" },
    { label: "进行中", value: s.inProgress, icon: <Circle className="size-4" />, className: "text-amber-600" },
    { label: "待办", value: s.todo, icon: <ListTodo className="size-4" />, className: "text-slate-600" },
    { label: "本周", value: s.thisWeek, icon: <Calendar className="size-4" />, className: "text-indigo-600" },
    { label: "已完成", value: s.done, icon: <CheckCircle2 className="size-4" />, className: "text-green-600" },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
      {items.map((it) => (
        <div
          key={it.label}
          className="border-border/60 bg-card flex items-center gap-2.5 rounded-lg border px-3 py-2"
        >
          <div className={cn("shrink-0", it.className)}>{it.icon}</div>
          <div className="min-w-0">
            <div className="text-lg font-semibold leading-none">{it.value}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">{it.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
