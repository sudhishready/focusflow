"use client"

import { useEffect, useState } from "react"
import { Session, loadSessions } from "@/lib/storage"

export default function Stats() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    setSessions(loadSessions())
    const interval = setInterval(() => setSessions(loadSessions()), 2000)
    return () => clearInterval(interval)
  }, [])

  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)
  const totalSessions = sessions.length

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todaySessions = sessions.filter((s) => s.completedAt >= startOfToday.getTime())
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0)

  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{todaySessions.length}</span>
        <span className="text-xs text-slate-400">Sessions Today</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{todayMinutes}</span>
        <span className="text-xs text-slate-400">Minutes Today</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{totalSessions}</span>
        <span className="text-xs text-slate-400">All Time Sessions</span>
      </div>
    </div>
  )
}