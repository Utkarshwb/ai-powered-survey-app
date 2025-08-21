"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, Users, Clock, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { ResponseOverview } from "./response-overview"
import { QuestionAnalytics } from "./question-analytics"
import { ResponseList } from "./response-list"
import { AIInsights } from "./ai-insights"
import { ExportMenu } from "./export-menu"
import type { Survey, Question } from "@/lib/types"

interface AnalyticsDashboardProps {
  survey: Survey
  questions: Question[]
  sessions: any[]
  responses: any[]
  userId: string
}

export function AnalyticsDashboard({ survey, questions, sessions, responses, userId }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const completedSessions = sessions.filter((s) => s.completed_at)
  const totalSessions = sessions.length
  const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0

  // Calculate average completion time
  const completionTimes = completedSessions
    .filter((s) => s.started_at && s.completed_at)
    .map((s) => new Date(s.completed_at).getTime() - new Date(s.started_at).getTime())

  const avgCompletionTime =
    completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const isPublished = survey.is_published

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Survey Analytics</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPublished && <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Published</Badge>}
          <ExportMenu surveyId={survey.id} surveyTitle={survey.title} />
        </div>
      </div>

      {/* Survey Info */}
      <Card className="mb-8 border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{survey.title}</CardTitle>
          {survey.description && <CardDescription className="text-gray-700 dark:text-gray-300">{survey.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedSessions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Responses</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(completionRate)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(avgCompletionTime)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{questions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300">Overview</TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300">Questions</TabsTrigger>
          <TabsTrigger value="responses" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300">Responses</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ResponseOverview sessions={sessions} responses={responses} questions={questions} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionAnalytics questions={questions} responses={responses} sessions={completedSessions} />
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <ResponseList sessions={completedSessions} responses={responses} questions={questions} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsights survey={survey} questions={questions} responses={responses} sessions={completedSessions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
