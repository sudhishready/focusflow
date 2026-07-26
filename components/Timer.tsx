"use client"

import { useEffect, useRef, useState } from "react"
import { Settings, Session, loadSettings, loadSessions, saveSessions } from "@/lib/storage"

type Mode = "focus" | "break" | "longBreak"

type TimerProps = {
  activeTaskId: string | null
  activeTaskTitle: string | null
  onSessionComplete: () => void
}

export default function Timer({ activeTaskId, activeTaskTitle, onSessionComplete }: TimerProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings())
  const [mode, setMode] = useState<Mode>("focus")
  const [secondsLeft, setSecondsLeft] = useState(settings.focusMinutes * 60)
  const [running, setRunning] = useState(false)
  const [completedFocusCount, setCompletedFocusCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (secondsLeft > 0) return
    handleModeSwitch()
  }, [secondsLeft])

  function handleModeSwitch() {
    setRunning(false)
    if (mode === "focus") {
      const sessions = loadSessions()
      const session: Session = {
        id: crypto.randomUUID(),
        taskId: activeTaskId,
        minutes: settings.focusMinutes,
        completedAt: Date.now(),
      }
      saveSessions([...sessions, session])
      onSessionComplete()
      const nextCount = completedFocusCount + 1
      setCompletedFocusCount(nextCount)
      if (nextCount % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak")
        setSecondsLeft(settings.longBreakMinutes * 60)
      } else {
        setMode("break")
        setSecondsLeft(settings.breakMinutes * 60)
      }
    } else {
      setMode("focus")
      setSecondsLeft(settings.focusMinutes * 60)
    }
  }

  function toggleRunning() {
    setRunning((r) => !r)
  }

  function resetTimer() {
    setRunning(false)
    setMode("focus")
    setSecondsLeft(settings.focusMinutes * 60)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <span className="text-sm uppercase tracking-widest text-slate-400">
        {mode === "focus" ? "Focus" : mode === "break" ? "Short Break" : "Long Break"}
      </span>
      {activeTaskTitle && (
        <span className="text-sm text-slate-500">Working on: {activeTaskTitle}</span>
      )}
      <span className="text-7xl font-bold tabular-nums text-white">{display}</span>
      <div className="flex gap-3">
        <button
          onClick={toggleRunning}
          className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-lg border border-slate-700 px-6 py-2 font-medium text-slate-300 hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </div>
  )
}