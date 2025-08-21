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
      <div className="relative overflow-hidden">
        <Card className="text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/30 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-pink-950/20 backdrop-blur-xl shadow-2xl dark:shadow-gray-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20" />
          <CardHeader className="relative pb-8 pt-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/25 border-2 border-white/20 backdrop-blur-sm">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Ready to Create Magic? ✨
            </CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-300 max-w-md mx-auto text-lg leading-relaxed">
              Transform your ideas into powerful surveys with AI assistance. Start building your first survey now and unlock insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pb-10">
            <Link href="/surveys/new">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/40 transform hover:scale-110 transition-all duration-500 border-2 border-white/20 backdrop-blur-sm px-10 py-4 text-lg font-semibold rounded-xl">
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Create Your First Survey
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="border border-gray-300 dark:border-gray-600 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl dark:shadow-gray-900/60 overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-purple-50/50 to-pink-50/30 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-pink-950/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Survey Collection
                  </span>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                    {surveys.length} masterpiece{surveys.length !== 1 ? 's' : ''} created
                  </div>
                </div>
              </CardTitle>
            </div>
            <Link href="/surveys/new">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 border border-white/20 px-6 py-3 rounded-xl">
                <Sparkles className="h-4 w-4 mr-2" />
                New Survey
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6">
            {surveys.map((survey, index) => (
              <div 
                key={survey.id} 
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-900/50 dark:to-blue-950/20 hover:from-blue-50/50 hover:via-purple-50/30 hover:to-pink-50/20 dark:hover:from-blue-950/30 dark:hover:via-purple-950/20 dark:hover:to-pink-950/10 transition-all duration-700 hover:shadow-2xl dark:hover:shadow-gray-900/60 hover:scale-[1.02] backdrop-blur-sm opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative flex items-center justify-between p-8">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border-2 border-white/20 backdrop-blur-sm">
                        <BarChart3 className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 mb-2">
                          {survey.title}
                        </h3>
                        {survey.description && (
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                            {survey.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant={survey.is_published ? "default" : "secondary"}
                            className={survey.is_published 
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg" 
                              : "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-none"
                            }
                          >
                            {survey.is_published ? "✨ Live" : "📝 Draft"}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(survey.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <ActionTooltip label="Edit survey">
                      <Link href={`/surveys/${survey.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                          <Edit className="h-5 w-5" />
                        </Button>
                      </Link>
                    </ActionTooltip>

                    <ActionTooltip label="View analytics">
                      <Link href={`/surveys/${survey.id}/analytics`}>
                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700 hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <BarChart3 className="h-5 w-5" />
                        </Button>
                      </Link>
                    </ActionTooltip>

                    {survey.is_published && (
                      <ActionTooltip label="View live survey">
                        <Link href={`/survey/${survey.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-700 hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                            <Eye className="h-5 w-5" />
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
