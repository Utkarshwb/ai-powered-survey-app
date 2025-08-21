import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Edit, Eye, BarChart3, Sparkles, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ActionTooltip } from "@/components/action-tooltip"

interface SurveyListProps {
  userId: string
}

export async function SurveyList({ userId }: SurveyListProps) {
  const supabase = await createClient()

  const { data: surveys } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!surveys || surveys.length === 0) {
    return (
      <Card className="text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">Create Your First Survey</CardTitle>
          <CardDescription>
            Get started by creating your first survey and gathering valuable insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/surveys/new">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Surveys ({surveys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{survey.title}</h3>
                    {survey.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{survey.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant={survey.is_published ? "default" : "secondary"}>
                        {survey.is_published ? "Published" : "Draft"}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(survey.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ActionTooltip label="Edit survey">
                      <Link href={`/surveys/${survey.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </ActionTooltip>
                    <ActionTooltip label="View analytics">
                      <Link href={`/surveys/${survey.id}/analytics`}>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </ActionTooltip>
                    {survey.is_published && (
                      <ActionTooltip label="View live survey">
                        <Link href={`/survey/${survey.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </ActionTooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
