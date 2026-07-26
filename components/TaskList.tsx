"use client"

import { useEffect, useState } from "react"
import { Task, loadTasks, saveTasks } from "@/lib/storage"

type TaskListProps = {
  activeTaskId: string | null
  onSelectTask: (id: string | null) => void
}

export default function TaskList({ activeTaskId, onSelectTask }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("General")

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  function addTask() {
    if (!newTaskTitle.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      done: false,
        category: newTaskCategory,
      createdAt: Date.now(),
    }
    const updated = [...tasks, task]
    setTasks(updated)
    saveTasks(updated)
    setNewTaskTitle("")
  }

  function toggleDone(id: string) {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    setTasks(updated)
    saveTasks(updated)
  }

  function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
    if (activeTaskId === id) onSelectTask(null)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold text-white">Tasks</h2>
      <div className="flex gap-2">
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="What are you working on?"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500"
        />
      <select
        value={newTaskCategory}
        onChange={(e) => setNewTaskCategory(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800 text-sm px-2"
      >
          <option>General</option>
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
      </select>
        <button
          onClick={addTask}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Add
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              activeTaskId === task.id ? "border-orange-500 bg-slate-800" : "border-slate-800"
            }`}
          >
            <button
              onClick={() => onSelectTask(task.id)}
              className={`flex-1 text-left ${task.done ? "text-slate-500 line-through" : "text-slate-200"}`}
            >
              {task.title}
            </button>
            <div className="flex gap-2">
              <button onClick={() => toggleDone(task.id)} className="text-xs text-slate-400 hover:text-white">
                {task.done ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteTask(task.id)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      </div>
  )
}