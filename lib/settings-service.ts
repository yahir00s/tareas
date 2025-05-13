"use client"

interface Settings {
  notifications: boolean
  emailNotifications: boolean
  reminderTime: string
  defaultView: string
  theme: string
  summaryFrequency: string
}

// In a real app, this would be a database or API call
// For this demo, we'll use localStorage

export async function getSettings(): Promise<Settings> {
  if (typeof window === "undefined") {
    return {
      notifications: true,
      emailNotifications: false,
      reminderTime: "30",
      defaultView: "list",
      theme: "system",
      summaryFrequency: "daily",
    }
  }

  const settingsJson = localStorage.getItem("settings")
  if (!settingsJson) {
    const defaultSettings = {
      notifications: true,
      emailNotifications: false,
      reminderTime: "30",
      defaultView: "list",
      theme: "system",
      summaryFrequency: "daily",
    }

    localStorage.setItem("settings", JSON.stringify(defaultSettings))
    return defaultSettings
  }

  return JSON.parse(settingsJson)
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  localStorage.setItem("settings", JSON.stringify(settings))
  return settings
}
