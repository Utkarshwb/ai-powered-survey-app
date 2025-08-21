"use client"

import { Button } from "@/components/ui/button"
import { Brain, Plus, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { ActionTooltip } from "@/components/action-tooltip"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">FormWise</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden md:block">Welcome, {user.email}</span>
          <ActionTooltip label="Create a new survey" side="bottom">
            <Link href="/surveys/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">New Survey</span>
              </Button>
            </Link>
          </ActionTooltip>
          <ActionTooltip label="Sign out" side="bottom">
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </ActionTooltip>
        </div>
      </div>
    </header>
  )
}
