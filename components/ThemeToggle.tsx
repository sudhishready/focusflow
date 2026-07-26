"use client"

import { useEffect, useState } from "react"
import { loadSettings, saveSettings } from "@/lib/storage"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const s = loadSettings()
    setTheme(s.theme)
    document.documentElement.classList.toggle("dark", s.theme === "dark")
  }, [])

  function toggle() {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    const s = loadSettings()
    saveSettings({ ...s, theme: next })
    }

  return (
    <button onClick={toggle}
      className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:text-white"
      >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  )
}