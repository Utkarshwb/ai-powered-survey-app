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
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Survey Analytics</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPublished && <Badge variant="default">Published</Badge>}
          <ExportMenu surveyId={survey.id} surveyTitle={survey.title} />
        </div>
      </div>

      {/* Survey Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
          {survey.description && <CardDescription>{survey.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{completedSessions.length}</div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{formatTime(avgCompletionTime)}</div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
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
