import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { FileText, Users, BarChart3, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get survey count
  const { count: surveyCount } = await supabase
    .from("surveys")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get total responses
  const { count: responseCount } = await supabase
    .from("responses")
    .select(
      `
      *,
      survey_sessions!inner(
        survey_id,
        surveys!inner(user_id)
      )
    `,
      { count: "exact", head: true },
    )
    .eq("survey_sessions.surveys.user_id", userId)

  // Get published surveys
  const { count: publishedCount } = await supabase
    .from("surveys")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_published", true)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{surveyCount || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publishedCount || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseCount || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Response Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {surveyCount && responseCount ? Math.round((responseCount / surveyCount) * 100) : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
