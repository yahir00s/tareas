export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  completed: boolean
  category?: string
  categoryColor?: string
  priority?: "high" | "medium" | "low"
  recurrence?: string
  hasAttachments?: boolean
}
