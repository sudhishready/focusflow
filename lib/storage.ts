export type Task = {
  id: string
  title: string
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
}

const TASKS_KEY = "focusflow_tasks"
const SESSIONS_KEY = "focusflow_sessions"
const SETTINGS_KEY = "focusflow_settings"

export const defaultSettings: Settings = {
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
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