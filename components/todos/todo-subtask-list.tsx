"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { genId } from "@/lib/todo-utils"
import type { Subtask } from "@/lib/todo-types"

interface SubtaskListProps {
  value: Subtask[]
  onChange: (subs: Subtask[]) => void
}

export function SubtaskList({ value, onChange }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState("")

  const toggle = (id: string) => {
    onChange(value.map((s) => (s.id === id ? { ...s, done: !s.done } : s)))
  }

  const remove = (id: string) => {
    onChange(value.filter((s) => s.id !== id))
  }

  const add = () => {
    const t = newTitle.trim()
    if (!t) return
    onChange([...value, { id: genId(), title: t, done: false }])
    setNewTitle("")
  }

  const completed = value.filter((s) => s.done).length

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="space-y-1.5">
          {value.map((s) => (
            <div key={s.id} className="group flex items-center gap-2">
              <Checkbox
                checked={s.done}
                onCheckedChange={() => toggle(s.id)}
              />
              <span
                className={
                  s.done
                    ? "text-muted-foreground line-through flex-1 text-sm"
                    : "flex-1 text-sm"
                }
              >
                {s.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(s.id)}
                className="opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="text-muted-foreground size-3.5" />
              </Button>
            </div>
          ))}
          <div className="text-muted-foreground text-xs">
            {completed} / {value.length} 已完成
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add()
            }
          }}
          placeholder="添加子任务..."
        />
        <Button type="button" variant="outline" size="icon" onClick={add}>
          <Plus />
        </Button>
      </div>
    </div>
  )
}
