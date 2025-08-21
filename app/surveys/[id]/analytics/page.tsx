import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

interface AnalyticsPageProps {
  params: { id: string }
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch survey data
  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (!survey) {
    redirect("/dashboard")
  }

  // Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", params.id)
    .order("order_index")

  // Fetch survey sessions
  const { data: sessions } = await supabase
    .from("survey_sessions")
    .select("*")
    .eq("survey_id", params.id)
    .order("started_at", { ascending: false })

  // Fetch responses
  const { data: responses } = await supabase
    .from("responses")
    .select(`
      *,
      survey_sessions!inner(survey_id)
    `)
    .eq("survey_sessions.survey_id", params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard
        survey={survey}
        questions={questions || []}
        sessions={sessions || []}
        responses={responses || []}
        userId={data.user.id}
      />
    </div>
  )
}
