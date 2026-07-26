"use client"

import { useEffect, useState } from "react"
import { Session, loadSessions, getStreak } from "@/lib/storage"

export default function History() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    setSessions(loadSessions())
    const id = setInterval(() => setSessions(loadSessions()), 3000)
    return () => clearInterval(id)
  }, [])

const streak = getStreak(sessions)
  const recent = [...sessions].reverse().slice(0, 6)
    
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">History</h2>
        <span className="text-sm text-orange-400">{streak} day streak</span>
      </div>
      {recent.length === 0 && (
        <p className="text-sm text-slate-500">No sessions yet, get to work</p>
      )}
      <ul className="flex flex-col gap-2">
        {recent.map((s) => (
          <li key={s.id} className="flex justify-between text-sm text-slate-300">
          <span>{new Date(s.completedAt).toLocaleDateString()}</span>
          <span>{s.minutes} min</span>
        </li>
        ))}
      </ul>
</div>
  )
}