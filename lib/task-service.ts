"use client"

import type { Task } from "@/types/task"
import { v4 as uuidv4 } from "uuid"

// In a real app, this would be a database or API call
// For this demo, we'll use localStorage

export async function getTasks(): Promise<Task[]> {
  if (typeof window === "undefined") return []

  const tasksJson = localStorage.getItem("tasks")
  if (!tasksJson) return []

  return JSON.parse(tasksJson)
}

export async function getTask(id: string): Promise<Task | null> {
  const tasks = await getTasks()
  return tasks.find((task) => task.id === id) || null
}

export async function createTask(taskData: Omit<Task, "id">): Promise<Task> {
  const tasks = await getTasks()

  const newTask: Task = {
    id: uuidv4(),
    ...taskData,
  }

  const updatedTasks = [...tasks, newTask]
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  return newTask
}

export async function updateTask(id: string, taskData: Partial<Task>): Promise<Task | null> {
  const tasks = await getTasks()
  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex === -1) return null

  const updatedTask = { ...tasks[taskIndex], ...taskData }
  tasks[taskIndex] = updatedTask

  localStorage.setItem("tasks", JSON.stringify(tasks))

  return updatedTask
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await getTasks()
  const updatedTasks = tasks.filter((task) => task.id !== id)

  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  return true
}
