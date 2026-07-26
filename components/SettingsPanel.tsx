"use client"

import { useEffect, useState } from "react"
import { Settings, defaultSettings, loadSettings, saveSettings } from "@/lib/storage"

type SettingsPanelProps = {
  onSave: () => void
}

export default function SettingsPanel({ onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  function handleChange(key: keyof Settings, value: number | boolean | string) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function handleSave() {
    saveSettings(settings)
    onSave()
    setOpen(false)
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-end text-sm text-slate-400 hover:text-white"
      >
        Settings
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold text-white">Settings</h2>
      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Focus minutes
        <input
          type="number"
          value={settings.focusMinutes}
          onChange={(e) => handleChange("focusMinutes", Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Break minutes
        <input
          type="number"
          value={settings.breakMinutes}
          onChange={(e) => handleChange("breakMinutes", Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Long break minutes
        <input
          type="number"
          value={settings.longBreakMinutes}
          onChange={(e) => handleChange("longBreakMinutes", Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Sessions before long break
        <input
          type="number"
          value={settings.sessionsBeforeLongBreak}
          onChange={(e) => handleChange("sessionsBeforeLongBreak", Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox"
          checked={settings.soundOn}
          onChange={(e) => handleChange("soundOn", e.target.checked)}
              />
            Sound when a session ends
      </label>
      <div className="flex gap-3">
        <button onClick={handleSave} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          Save
        </button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
          Cancel
        </button>
      </div>
    </div>
  )
}
