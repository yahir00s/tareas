"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { saveSettings } from "@/lib/settings-service"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [reminderTime, setReminderTime] = useState("30")
  const [defaultView, setDefaultView] = useState("list")
  const [theme, setTheme] = useState("system")
  const [summaryFrequency, setSummaryFrequency] = useState("daily")

  const handleSaveSettings = async () => {
    await saveSettings({
      notifications,
      emailNotifications,
      reminderTime,
      defaultView,
      theme,
      summaryFrequency,
    })

    // Show success message
  }

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="notifications" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications about your tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Default Reminder Time</Label>
                <p className="text-sm text-muted-foreground">
                  How many minutes before a task is due should we remind you?
                </p>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary-frequency">Task Summary Frequency</Label>
                <p className="text-sm text-muted-foreground">
                  How often would you like to receive a summary of your tasks?
                </p>
                <Select value={summaryFrequency} onValueChange={setSummaryFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-view">Default Task View</Label>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="calendar">Calendar View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="Student User" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" defaultValue="student@university.edu" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </main>
  )
}
