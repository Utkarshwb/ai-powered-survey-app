import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

interface AnalyticsPageProps {
  params: Promise<{ id: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch survey data
  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (!survey) {
    redirect("/dashboard")
  }

  // Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", id)
    .order("order_index")

  // Fetch survey sessions
  const { data: sessions } = await supabase
    .from("survey_sessions")
    .select("*")
    .eq("survey_id", id)
    .order("started_at", { ascending: false })

  // Fetch responses
  const { data: responses } = await supabase
    .from("responses")
    .select(`
      *,
      survey_sessions!inner(survey_id)
    `)
    .eq("survey_sessions.survey_id", id)

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative">
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background: "#ffffff",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      <div className="relative z-10">
        <AnalyticsDashboard
          survey={survey}
          questions={questions || []}
          sessions={sessions || []}
          responses={responses || []}
          userId={data.user.id}
        />
      </div>
    </div>
  )
}
