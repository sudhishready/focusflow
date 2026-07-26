"use client"

import { useState } from "react"
import Timer from "@/components/Timer"
import TaskList from "@/components/TaskList"
import Stats from "@/components/Stats"
import SettingsPanel from "@/components/SettingsPanel"
import History from "@/components/History"
import ThemeToggle from "@/components/ThemeToggle"
import { loadTasks } from "@/lib/storage"

export default function Home() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSelectTask(id: string | null) {
    setActiveTaskId(id)
    if (id) {
      const tasks = loadTasks()
      const task = tasks.find((t) => t.id === id)
      setActiveTaskTitle(task ? task.title : null)
    } else {
      setActiveTaskTitle(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">FocusFlow</h1>
          <SettingsPanel onSave={() => setRefreshKey((k) => k + 1)}
          />
      <ThemeToggle />
        </div>
        <Timer
          key={refreshKey}
          activeTaskId={activeTaskId}
          activeTaskTitle={activeTaskTitle}
          onSessionComplete={() => setRefreshKey((k) => k + 1)}
        />
        <Stats />
        <TaskList
          activeTaskId={activeTaskId}
          onSelectTask={handleSelectTask}
        />
      <History />
      </div>
    </main>
  )
}