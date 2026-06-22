"use client"

import dynamic from "next/dynamic"

const TodoPage = dynamic(
  () => import("@/components/todos/todo-page").then((m) => m.TodoPage),
  { ssr: false }
)

export default function Page() {
  return <TodoPage />
}
