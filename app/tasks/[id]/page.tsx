"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Paperclip, Trash2 } from "lucide-react"
import { getTask, updateTask, deleteTask } from "@/lib/task-service"
import { getCategories } from "@/lib/category-service"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [recurrence, setRecurrence] = useState("")
  const [completed, setCompleted] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true)
      try {
        const taskData = await getTask(params.id)
        if (!taskData) {
          router.push("/tasks")
          return
        }

        setTask(taskData)
        setTitle(taskData.title)
        setDescription(taskData.description || "")
        setPriority(taskData.priority || "")
        setRecurrence(taskData.recurrence || "")
        setCompleted(taskData.completed)

        if (taskData.dueDate) {
          setDueDate(new Date(taskData.dueDate))
        }

        const cats = await getCategories()
        setCategories(cats)

        if (taskData.category) {
          const categoryObj = cats.find((c) => c.name === taskData.category)
          if (categoryObj) {
            setCategory(categoryObj.id)
          }
        }
      } catch (error) {
        console.error("Failed to load task:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTask()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return

    setIsSubmitting(true)

    try {
      const selectedCategory = categories.find((c) => c.id === category)

      await updateTask(params.id, {
        title,
        description,
        category: selectedCategory?.name || "",
        categoryColor: selectedCategory?.color || "",
        priority,
        dueDate: dueDate.toISOString(),
        recurrence,
        completed,
      })

      router.push("/tasks")
      router.refresh()
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await deleteTask(params.id)
      router.push("/tasks")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading task...</p>
        </div>
      </main>
    )
  }

  if (!task) {
    return (
      <main className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <p>Task not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Task</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence">Recurrence</Label>
                <Select value={recurrence} onValueChange={setRecurrence}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border border-input rounded-md p-2">
                <Button type="button" variant="outline" className="w-full">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Add Attachments
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}
