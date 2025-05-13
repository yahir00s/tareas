"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, CalendarIcon, List } from "lucide-react"
import TaskList from "@/components/task-list"
import TaskCalendar from "@/components/task-calendar"
import Link from "next/link"

export default function TasksPage() {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [filter, setFilter] = useState<string>("all")

  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/tasks/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === "calendar" ? "default" : "outline"} size="icon" onClick={() => setView("calendar")}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "list" ? <TaskList filter={filter} /> : <TaskCalendar />}
    </main>
  )
}
