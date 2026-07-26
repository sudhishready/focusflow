export type Task = {
  id: string
  title: string
  category: string
  done: boolean
  createdAt: number
}

export type Session = {
  id: string
  taskId: string | null
  minutes: number
  completedAt: number
}

export type Settings = {
  focusMinutes: number
  breakMinutes: number
  longBreakMinutes: number
  sessionsBeforeLongBreak: number
  theme: "light" | "dark"
  soundOn: boolean
}

const TASKS_KEY = "focusflow_tasks"
const SESSIONS_KEY = "focusflow_sessions"
const SETTINGS_KEY = "focusflow_settings"

export const defaultSettings: Settings = {
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  theme: "light",
  soundOn: true,
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(TASKS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(SESSIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveSessions(sessions: Session[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings
  const raw = localStorage.getItem(SETTINGS_KEY)
  return raw ? JSON.parse(raw) : defaultSettings
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0
  const days = new Set(
    sessions.map((s) => new Date(s.completedAt).toDateString())
  )
  let streak = 0
  let cursor = new Date()
  while (days.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}