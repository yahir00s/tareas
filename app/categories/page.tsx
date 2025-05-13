"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import { getCategories, createCategory, deleteCategory } from "@/lib/category-service"

interface Category {
  id: string
  name: string
  color: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1")

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
    }

    loadCategories()
  }, [])

  const handleCreateCategory = async () => {
    if (!newCategoryName) return

    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        color: newCategoryColor,
      })

      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setNewCategoryColor("#6366f1")
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id)
      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="w-full sm:w-32 space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="h-10 p-1 cursor-pointer"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateCategory} className="w-full sm:w-auto">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Categories</h2>

        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories yet. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
