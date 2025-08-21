import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SurveyList } from "@/components/dashboard/survey-list"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardStats userId={data.user.id} />
          <SurveyList userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}
