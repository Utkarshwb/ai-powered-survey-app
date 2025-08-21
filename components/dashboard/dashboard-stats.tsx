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
      <Card className="group relative overflow-hidden border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-gray-900/60 transition-all duration-500 hover:scale-105 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            Total Surveys
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <FileText className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {surveyCount || 0}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">surveys created</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-950/30 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-gray-900/60 transition-all duration-500 hover:scale-105 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
            Published
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {publishedCount || 0}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">live surveys</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-950/30 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-gray-900/60 transition-all duration-500 hover:scale-105 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            Total Responses
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Users className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {responseCount || 0}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">responses collected</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-yellow-50/30 dark:from-gray-800 dark:to-yellow-950/30 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-gray-900/60 transition-all duration-500 hover:scale-105 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
            Avg. Response Rate
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {surveyCount && responseCount ? Math.round((responseCount / surveyCount) * 100) : 0}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">completion rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
