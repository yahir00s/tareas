import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/layout/sidebar"
import MobileNav from "@/components/mobile-nav"
import RegisterSW from "./register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskMaster - Student Task Management",
  description: "A task management application for university students",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskMaster",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RegisterSW />
          <div className="flex min-h-screen">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 md:pl-64">
              <div className="pt-16 md:pt-4 pb-16">{children}</div>
            </div>
          </div>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
