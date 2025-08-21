import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Edit, Eye, BarChart3, Trash2 } from "lucide-react"
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
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Surveys Yet</CardTitle>
          <CardDescription>Get started by creating your first survey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/surveys/new">
            <Button>Create Survey</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Surveys</CardTitle>
        <CardDescription>Manage and analyze your surveys</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{survey.title}</h3>
                  <Badge variant={survey.is_published ? "default" : "secondary"}>
                    {survey.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                {survey.description && <p className="text-sm text-gray-600 mb-2">{survey.description}</p>}
                <p className="text-xs text-gray-500">Created {new Date(survey.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <ActionTooltip label="Edit survey">
                  <Link href={`/surveys/${survey.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </ActionTooltip>

                {survey.is_published && (
                  <>
                    <ActionTooltip label="View analytics">
                      <Link href={`/surveys/${survey.id}/analytics`}>
                        <Button variant="ghost" size="icon">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </ActionTooltip>
                    <ActionTooltip label="View live survey">
                      <Link href={`/survey/${survey.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </ActionTooltip>
                  </>
                )}
                 <ActionTooltip label="Delete survey">
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ActionTooltip>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
