"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"
import { getTasks } from "@/lib/task-service"
import { isSameDay } from "date-fns"

export default function TaskCalendar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([])

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await getTasks()
      setTasks(allTasks)

      if (date) {
        const tasksOnSelectedDay = allTasks.filter((task) => isSameDay(new Date(task.dueDate), date))
        setSelectedDayTasks(tasksOnSelectedDay)
      }
    }

    loadTasks()
  }, [date])

  const getDayTasks = (day: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), day))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: (props) => {
              const dayTasks = getDayTasks(props.date)
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {props.day}
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-0.5">
                        {dayTasks.length <= 3 ? (
                          dayTasks.map((task, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: task.categoryColor || "#888" }}
                            />
                          ))
                        ) : (
                          <>
                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            },
          }}
        />
      </div>

      <div>
        <h3 className="font-medium mb-4">{date ? <>Tasks for {date.toLocaleDateString()}</> : <>Select a date</>}</h3>

        {selectedDayTasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks for this day</p>
        ) : (
          <div className="space-y-3">
            {selectedDayTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        {task.priority && (
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      {task.category && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: task.categoryColor || "#888" }}
                          />
                          <span>{task.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
