import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>You appear to be offline. Please check your internet connection.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Don't worry, you can still access your previously loaded tasks and continue working offline.
          </p>
          <Link href="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
