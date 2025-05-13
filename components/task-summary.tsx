import { Card, CardContent } from "@/components/ui/card"

interface TaskSummaryProps {
  title: string
  count: number
  color: string
}

export default function TaskSummary({ title, count, color }: TaskSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-white font-bold text-xl">{count}</span>
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {title === "Completed" ? "tasks completed" : "tasks remaining"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
