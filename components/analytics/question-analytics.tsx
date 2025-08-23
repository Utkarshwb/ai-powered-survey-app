"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

interface QuestionAnalyticsProps {
  questions: any[]
  responses: any[]
  sessions: any[]
}

export function QuestionAnalytics({ questions, responses, sessions }: QuestionAnalyticsProps) {
  const getQuestionAnalytics = (question: any) => {
    const questionResponses = responses.filter((r) => r.question_id === question.id)

    switch (question.question_type) {
      case "multiple_choice":
        const optionCounts =
          question.options?.reduce((acc: any, option: string) => {
            acc[option] = questionResponses.filter((r) => r.answer_text === option).length
            return acc
          }, {}) || {}

        return {
          type: "pie",
          data: Object.entries(optionCounts).map(([option, count]) => ({
            name: option,
            value: count as number,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          })),
        }

      case "rating":
        const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
          rating: `${rating} Star${rating !== 1 ? "s" : ""}`,
          count: questionResponses.filter((r) => r.answer_number === rating).length,
        }))

        return {
          type: "bar",
          data: ratingCounts,
        }

      case "yes_no":
        const yesCount = questionResponses.filter((r) => r.answer_boolean === true).length
        const noCount = questionResponses.filter((r) => r.answer_boolean === false).length

        return {
          type: "pie",
          data: [
            { name: "Yes", value: yesCount, color: "#22c55e" },
            { name: "No", value: noCount, color: "#ef4444" },
          ],
        }

      case "number":
        const numbers = questionResponses.map((r) => r.answer_number).filter((n) => n !== null && n !== undefined)

        if (numbers.length === 0) return { type: "none", data: [] }

        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length
        const min = Math.min(...numbers)
        const max = Math.max(...numbers)

        return {
          type: "stats",
          data: { avg: avg.toFixed(2), min, max, count: numbers.length },
        }

      default:
        return {
          type: "text",
          data: { count: questionResponses.length },
        }
    }
  }

  const colors = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const analytics = getQuestionAnalytics(question)
        const responseCount = responses.filter((r) => r.question_id === question.id).length
        const responseRate = sessions.length > 0 ? (responseCount / sessions.length) * 100 : 0

        return (
          <Card key={question.id} className="border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    Question {question.order_index + 1}: {question.question_text}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 text-gray-700 dark:text-gray-300">
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{question.question_type.replace("_", " ")}</Badge>
                    <span>
                      {responseCount} responses ({Math.round(responseRate)}%)
                    </span>
                    {question.is_required && <Badge variant="secondary">Required</Badge>}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {analytics.type === "pie" && analytics.data.length > 0 && (
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {analytics.data.map((entry: any, i: number) => (
                          <Cell key={`cell-${i}`} fill={entry.color || colors[i % colors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {analytics.type === "bar" && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.data}>
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}

              {analytics.type === "stats" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.data.avg}</div>
                    <div className="text-sm text-blue-800">Average</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.data.min}</div>
                    <div className="text-sm text-green-800">Minimum</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analytics.data.max}</div>
                    <div className="text-sm text-orange-800">Maximum</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analytics.data.count}</div>
                    <div className="text-sm text-purple-800">Responses</div>
                  </div>
                </div>
              )}

              {analytics.type === "text" && (
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-gray-600">{analytics.data.count}</div>
                  <div className="text-sm text-gray-500">Text responses received</div>
                  <p className="text-sm text-gray-400 mt-2">View individual responses in the Responses tab</p>
                </div>
              )}

              {analytics.data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No responses yet for this question</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default QuestionAnalytics
