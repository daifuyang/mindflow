"use client"

import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getHeaderLabel } from "@/lib/todo-utils"
import type { TaskPriority, TaskStatus, TaskView } from "@/lib/todo-types"
import { VIEW_META } from "@/lib/todo-types"

interface ToolbarProps {
  view: TaskView
  currentDate: Date
  onViewChange: (view: TaskView) => void
  onDateChange: (date: Date) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onCreate: () => void
  search: string
  onSearchChange: (s: string) => void
  statusFilter: TaskStatus | "all"
  onStatusFilterChange: (s: TaskStatus | "all") => void
  priorityFilter: TaskPriority | "all"
  onPriorityFilterChange: (p: TaskPriority | "all") => void
}

export function TodoToolbar({
  view,
  currentDate,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreate,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={onPrev} aria-label="上一个">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday} className="px-3">
          今天
        </Button>
        <Button variant="outline" size="icon" onClick={onNext} aria-label="下一个">
          <ChevronRight />
        </Button>
      </div>

      <h2 className="text-base font-semibold md:text-lg">
        {getHeaderLabel(view, currentDate)}
      </h2>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-2 top-1/2 size-3.5 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索任务..."
            className="h-8 w-32 pl-7 text-xs sm:w-44"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="清空"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusFilterChange(v as TaskStatus | "all")}
        >
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="todo">待办</SelectItem>
            <SelectItem value="in_progress">进行中</SelectItem>
            <SelectItem value="done">已完成</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => onPriorityFilterChange(v as TaskPriority | "all")}
        >
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>

        <div className="border-border/60 bg-muted/40 inline-flex items-center rounded-lg border p-0.5">
          {(["day", "week", "month"] as TaskView[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                view === v
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {VIEW_META[v].label}
            </button>
          ))}
        </div>

        <Button onClick={onCreate} size="sm">
          <Plus />
          新建
        </Button>
      </div>
    </div>
  )
}
