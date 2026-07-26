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
      if (typeof Notification !== "undefined") {
      Notification.requestPermission()
    }
  }, [])

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

  function playBeep() {
  if (!settings.soundOn) return
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 880
  gain.gain.value = 0.1
  osc.start()
  osc.stop(ctx.currentTime + 0.2)
}

  function notify(msg: string) {
  if (typeof Notification === "undefined") return
  new Notification(msg)
  }
    function handleModeSwitch() {
    setRunning(false)
    playBeep()
    notify("Session done, nice work")
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

  useEffect(() => {
      function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
          toggleRunning()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    }, [])

  function resetTimer() {
    setRunning(false)
    setMode("focus")
    setSecondsLeft(settings.focusMinutes * 60)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  const totalSeconds = mode === "focus" ? settings.focusMinutes * 60 : mode === "break" ? settings.breakMinutes * 60 : settings.longBreakMinutes * 60
  const progress = 1 - secondsLeft / totalSeconds

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <span className="text-sm uppercase tracking-widest text-slate-400">
        {mode === "focus" ? "Focus" : mode === "break" ? "Short Break" : "Long Break"}
      </span>
      {activeTaskTitle && (
        <span className="text-sm text-slate-500">Working on: {activeTaskTitle}</span>
      )}
      <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#334155" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r="45" stroke="#f97316" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`} strokeLinecap="round" />
        </svg>
      <span className="text-5xl font-bold tabular-nums text-white">{display}</span>
      </div>
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