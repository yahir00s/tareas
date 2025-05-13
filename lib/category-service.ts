"use client"

import { v4 as uuidv4 } from "uuid"

interface Category {
  id: string
  name: string
  color: string
}

// In a real app, this would be a database or API call
// For this demo, we'll use localStorage

export async function getCategories(): Promise<Category[]> {
  if (typeof window === "undefined") return []

  const categoriesJson = localStorage.getItem("categories")
  if (!categoriesJson) {
    // Initialize with default categories
    const defaultCategories = [
      { id: uuidv4(), name: "Math", color: "#ef4444" },
      { id: uuidv4(), name: "Science", color: "#3b82f6" },
      { id: uuidv4(), name: "Literature", color: "#10b981" },
      { id: uuidv4(), name: "History", color: "#f59e0b" },
    ]

    localStorage.setItem("categories", JSON.stringify(defaultCategories))
    return defaultCategories
  }

  return JSON.parse(categoriesJson)
}

export async function createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
  const categories = await getCategories()

  const newCategory: Category = {
    id: uuidv4(),
    ...categoryData,
  }

  const updatedCategories = [...categories, newCategory]
  localStorage.setItem("categories", JSON.stringify(updatedCategories))

  return newCategory
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories()
  const updatedCategories = categories.filter((category) => category.id !== id)

  localStorage.setItem("categories", JSON.stringify(updatedCategories))

  return true
}
