"use client"

import { Button } from "@/components/ui/button"
import { Brain, Plus, LogOut, Sun, Moon, Mail } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { ActionTooltip } from "@/components/action-tooltip"
import { useTheme } from "next-themes"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Dark Mode Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-300 dark:border-gray-600 shadow-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-900 dark:text-gray-100" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-900 dark:text-gray-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      {/* Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full border border-gray-300 dark:border-gray-600 shadow-xl px-6 py-2 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gray-900 dark:text-gray-100" />
            <span className="font-medium text-gray-900 dark:text-gray-100">FormWise</span>
          </div>
          <div className="flex items-center gap-3">
            <ActionTooltip label="Send Feedback">
              <Link href="/feedback">
                <Button variant="ghost" size="sm" className="rounded-full px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <Mail className="h-4 w-4 mr-1" />
                  Feedback
                </Button>
              </Link>
            </ActionTooltip>
            
            <ActionTooltip label="Create New Survey">
              <Link href="/surveys/new">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
                  <Plus className="h-4 w-4 mr-1" />
                  New Survey
                </Button>
              </Link>
            </ActionTooltip>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-full border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}
