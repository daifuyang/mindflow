"use client"

import { useEffect, useState } from "react"
import { Trash2, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TagInput } from "./todo-tag-input"
import { SubtaskList } from "./todo-subtask-list"
import { fromDateInputLocal, toDateInputLocal } from "@/lib/todo-utils"
import type { Subtask, Task, TaskInput, TaskPriority, TaskStatus } from "@/lib/todo-types"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  defaultDate?: Date | null
  onSubmit: (input: TaskInput) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "待办" },
  { value: "in_progress", label: "进行中" },
  { value: "done", label: "已完成" },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
  { value: "urgent", label: "紧急" },
]

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultDate,
  onSubmit,
  onDelete,
}: TaskDialogProps) {
  const isEdit = !!task
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("todo")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [allDay, setAllDay] = useState(false)
  const [startAt, setStartAt] = useState("")
  const [dueAt, setDueAt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [reminderAt, setReminderAt] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? "")
      setStatus(task.status)
      setPriority(task.priority)
      setAllDay(task.allDay)
      setStartAt(toDateInputLocal(task.startAt))
      setDueAt(toDateInputLocal(task.dueAt))
      setTags(task.tags)
      setSubtasks(task.subtasks)
      setReminderAt(toDateInputLocal(task.reminderAt))
    } else {
      setTitle("")
      setDescription("")
      setStatus("todo")
      setPriority("medium")
      setAllDay(false)
      setTags([])
      setSubtasks([])
      setReminderAt("")
      if (defaultDate) {
        const d = new Date(defaultDate)
        d.setHours(9, 0, 0, 0)
        setStartAt(toDateInputLocal(d.toISOString()))
        const e = new Date(defaultDate)
        e.setHours(10, 0, 0, 0)
        setDueAt(toDateInputLocal(e.toISOString()))
      } else {
        setStartAt("")
        setDueAt("")
      }
    }
    setError("")
  }, [open, task, defaultDate])

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("标题不能为空")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const input: TaskInput = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        allDay,
        startAt: allDay ? null : fromDateInputLocal(startAt),
        dueAt: fromDateInputLocal(dueAt),
        tags,
        subtasks,
        reminderAt: fromDateInputLocal(reminderAt),
      }
      await onSubmit(input)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !onDelete) return
    if (!confirm("确定删除此任务?该操作不可撤销。")) return
    setSubmitting(true)
    try {
      await onDelete(task.id)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑任务" : "新建任务"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "修改任务详情" : "添加一个新的待办任务"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">标题</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如:完成项目方案"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">描述</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="补充说明..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>状态</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>优先级</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="all-day"
                checked={allDay}
                onCheckedChange={(c) => setAllDay(c === true)}
              />
              <Label htmlFor="all-day" className="cursor-pointer">
                全天
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>开始</Label>
              <Input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                disabled={allDay}
              />
            </div>
            <div className="space-y-1.5">
              <Label>截止</Label>
              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>标签</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="按回车添加标签..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>子任务</Label>
            <SubtaskList value={subtasks} onChange={setSubtasks} />
          </div>

          <div className="space-y-1.5">
            <Label>提醒</Label>
            <Input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-2 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="-mx-4 -mb-4 mt-2">
          {isEdit && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              <Trash2 />
              删除
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            取消
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            <Save />
            {submitting ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
