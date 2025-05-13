"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CheckSquare, Calendar, Tag, BarChart, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname === "/tasks" || pathname.startsWith("/tasks/"),
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "/calendar",
      active: pathname === "/calendar",
    },
    {
      label: "Categories",
      icon: Tag,
      href: "/categories",
      active: pathname === "/categories",
    },
    {
      label: "Reports",
      icon: BarChart,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">TaskMaster</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
                <Button variant={route.active ? "default" : "ghost"} className="w-full justify-start">
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
