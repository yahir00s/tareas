"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Paperclip } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Task } from "@/types/task"
import { getTasks, updateTask } from "@/lib/task-service"

interface TaskListProps {
  limit?: number
  filter?: string
}

export default function TaskList({ limit, filter }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await getTasks()
      let filteredTasks = allTasks

      if (filter === "today") {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        filteredTasks = allTasks.filter((task) => {
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        })
      } else if (filter === "pending") {
        filteredTasks = allTasks.filter((task) => !task.completed)
      } else if (filter === "completed") {
        filteredTasks = allTasks.filter((task) => task.completed)
      }

      // Sort by due date (closest first)
      filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      if (limit) {
        filteredTasks = filteredTasks.slice(0, limit)
      }

      setTasks(filteredTasks)
    }

    loadTasks()
  }, [limit, filter])

  const handleTaskComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed })
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No tasks found. Create a new task to get started.</div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-4 gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => handleTaskComplete(task.id, checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                  <h3 className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {task.category && (
                      <Badge
                        style={{ backgroundColor: task.categoryColor || undefined }}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        {task.category}
                      </Badge>
                    )}
                    {task.priority && (
                      <Badge
                        variant={
                          task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "outline"
                        }
                        className="whitespace-nowrap"
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                    </div>
                  )}
                  {task.hasAttachments && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      <span>Attachments</span>
                    </div>
                  )}
                  {task.recurrence && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{task.recurrence}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
