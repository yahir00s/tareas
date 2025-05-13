"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTasks } from "@/lib/task-service"
import type { Task } from "@/types/task"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await getTasks()
      setTasks(allTasks)
    }

    loadTasks()
  }, [])

  // Calculate completion rate
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Data for category distribution
  const categoryData = tasks.reduce((acc: { name: string; value: number }[], task) => {
    if (!task.category) return acc

    const existingCategory = acc.find((item) => item.name === task.category)
    if (existingCategory) {
      existingCategory.value += 1
    } else {
      acc.push({ name: task.category, value: 1 })
    }

    return acc
  }, [])

  // Data for weekly completion
  const weeklyData = [
    { name: "Mon", completed: 4, pending: 2 },
    { name: "Tue", completed: 3, pending: 1 },
    { name: "Wed", completed: 2, pending: 3 },
    { name: "Thu", completed: 5, pending: 0 },
    { name: "Fri", completed: 1, pending: 4 },
    { name: "Sat", completed: 0, pending: 1 },
    { name: "Sun", completed: 2, pending: 0 },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32">
              <div className="text-4xl font-bold">{completionRate}%</div>
              <p className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-red-500">5</div>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-yellow-500">8</div>
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-green-500">12</div>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-center h-32">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Math Project</span>
                  <span className="text-xs text-red-500">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Physics Lab</span>
                  <span className="text-xs text-yellow-500">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Literature Essay</span>
                  <span className="text-xs text-muted-foreground">In 3 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="#fb7185" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
