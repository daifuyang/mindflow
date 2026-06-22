"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ value, onChange, placeholder, className }: TagInputProps) {
  const [input, setInput] = useState("")

  const add = (raw: string) => {
    const t = raw.trim()
    if (!t) return
    if (value.includes(t)) {
      setInput("")
      return
    }
    onChange([...value, t])
    setInput("")
  }

  const remove = (t: string) => {
    onChange(value.filter((x) => x !== t))
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      add(input)
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        "border-input bg-transparent dark:bg-input/30 flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5",
        className
      )}
    >
      {value.map((t) => (
        <span
          key={t}
          className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
        >
          {t}
          <button
            type="button"
            onClick={() => remove(t)}
            className="hover:text-foreground text-muted-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => input && add(input)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="text-sm outline-none placeholder:text-muted-foreground flex-1 min-w-[80px] bg-transparent"
      />
    </div>
  )
}
