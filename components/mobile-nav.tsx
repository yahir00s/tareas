"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Calendar, Settings, PlusCircle } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname === "/tasks" || (pathname.startsWith("/tasks/") && pathname !== "/tasks/new"),
    },
    {
      label: "New",
      icon: PlusCircle,
      href: "/tasks/new",
      active: pathname === "/tasks/new",
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "/calendar",
      active: pathname === "/calendar",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex flex-col items-center justify-center w-full h-full text-xs ${
              route.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <route.icon className="h-5 w-5 mb-1" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
