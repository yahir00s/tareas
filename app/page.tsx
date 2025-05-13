import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TaskList from "@/components/task-list"
import TaskSummary from "@/components/task-summary"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-muted-foreground mb-4">Manage your academic tasks and stay organized</p>
        </div>
        <div className="flex items-start">
          <Link href="/tasks/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TaskSummary title="Pending" count={5} color="bg-yellow-500" />
        <TaskSummary title="Due Today" count={2} color="bg-red-500" />
        <TaskSummary title="Completed" count={12} color="bg-green-500" />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <Link href="/tasks">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <TaskList limit={5} />
      </div>
    </main>
  )
}
