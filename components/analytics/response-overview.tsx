"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface ResponseOverviewProps {
  sessions: any[]
  responses: any[]
  questions: any[]
}

export function ResponseOverview({ sessions, responses, questions }: ResponseOverviewProps) {
  // Prepare data for charts
  const completedSessions = sessions.filter((s) => s.completed_at)

  // Daily responses over the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyData = last7Days.map((date) => {
    const count = completedSessions.filter((s) => s.completed_at && s.completed_at.startsWith(date)).length
    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      responses: count,
    }
  })

  // Completion status
  const completionData = [
    { name: "Completed", value: completedSessions.length, color: "#22c55e" },
    { name: "Started", value: sessions.length - completedSessions.length, color: "#f59e0b" },
  ]

  // Response rate by question
  const questionResponseRates = questions.map((question) => {
    const questionResponses = responses.filter((r) => r.question_id === question.id)
    const rate = completedSessions.length > 0 ? (questionResponses.length / completedSessions.length) * 100 : 0

    return {
      question: `Q${question.order_index + 1}`,
      rate: Math.round(rate),
      title: question.question_text.substring(0, 30) + (question.question_text.length > 30 ? "..." : ""),
    }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Daily Responses */}
      <Card className="border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Daily Responses</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300 text-sm">Response count over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              responses: {
                label: "Responses",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[180px] sm:h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="responses"
                  stroke="var(--color-responses)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-responses)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Completion Status */}
      <Card className="border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Completion Status</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300 text-sm">Survey completion breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completed: {
                label: "Completed",
                color: "#22c55e",
              },
              started: {
                label: "Started",
                color: "#f59e0b",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Question Response Rates */}
      <Card className="lg:col-span-2 border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Question Response Rates</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">Percentage of respondents who answered each question</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rate: {
                label: "Response Rate %",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionResponseRates} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="question" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [`${value}%`, "Response Rate", props.payload?.title]}
                />
                <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
