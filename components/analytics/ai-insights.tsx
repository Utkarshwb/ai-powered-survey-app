"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, TrendingUp, Users, AlertTriangle, Lightbulb } from "lucide-react"

interface AIInsightsProps {
  survey: any
  questions: any[]
  responses: any[]
  sessions: any[]
}

export function AIInsights({ survey, questions, responses, sessions }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          survey,
          questions,
          responses: responses.slice(0, 50), // Limit for API
          sessions,
        }),
      })

      const data = await response.json()
      if (data.insights) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getSentimentColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50"
    if (score >= 6) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="space-y-6">
      {!insights ? (
        <Card>
          <CardHeader className="text-center">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Get intelligent analysis of your survey responses with actionable recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={generateInsights} disabled={isGenerating || responses.length === 0}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Responses...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </>
              )}
            </Button>
            {responses.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">You need at least one response to generate insights</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overall Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div
                  className={`text-3xl font-bold px-4 py-2 rounded-lg ${getSentimentColor(insights.sentiment_score)}`}
                >
                  {insights.sentiment_score}/10
                </div>
                <div>
                  <div className="font-medium">
                    {insights.sentiment_score >= 8
                      ? "Very Positive"
                      : insights.sentiment_score >= 6
                        ? "Neutral"
                        : "Needs Attention"}
                  </div>
                  <div className="text-sm text-gray-600">Overall response sentiment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.key_findings.map((finding: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-blue-900">{finding}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Identified Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.trends.map((trend: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-green-900">{trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Actionable Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-purple-900">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Quality & Patterns */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Quality Assessment</div>
                    <div className="text-sm text-gray-600">{insights.response_quality}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Completion Analysis</div>
                    <div className="text-sm text-gray-600">{insights.completion_rate_analysis}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notable Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.notable_patterns.map((pattern: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{pattern}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regenerate Button */}
          <Card>
            <CardContent className="text-center py-6">
              <Button variant="outline" onClick={generateInsights} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate Insights
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">Get fresh insights as new responses come in</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
