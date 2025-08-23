"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Loader2, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface SurveyAnalyzerProps {
  surveyId: string
}

export function SurveyAnalyzer({ surveyId }: SurveyAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/analyze-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId }),
      })

      const data = await response.json()
      if (data.analysis) {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error("Error analyzing survey:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Survey Analysis
          </CardTitle>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Survey"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(analysis?.overall_score || 5)}`}>
                {analysis?.overall_score || 5}/10
              </div>
              <div className="text-sm text-gray-600">Overall Survey Quality</div>
              <Progress value={(analysis?.overall_score || 5) * 10} className="mt-2" />
            </div>

            {/* Completion Time */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Estimated completion time: {analysis?.estimated_completion_time || "Not available"}</span>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h4>
              <div className="space-y-1">
                {analysis?.strengths && Array.isArray(analysis.strengths) ? analysis.strengths.map((strength: string, index: number) => (
                  <div key={index} className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    {strength}
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 p-2">No strengths identified yet</div>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Areas for Improvement
              </h4>
              <div className="space-y-1">
                {analysis?.weaknesses && Array.isArray(analysis.weaknesses) ? analysis.weaknesses.map((weakness: string, index: number) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {weakness}
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 p-2">No areas for improvement identified</div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <div className="space-y-2">
                {analysis?.recommendations && Array.isArray(analysis.recommendations) ? analysis.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="border rounded p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{rec.type || 'General'}</Badge>
                      {rec.question_index !== undefined && (
                        <span className="text-xs text-gray-500">Question {rec.question_index + 1}</span>
                      )}
                    </div>
                    <div className="font-medium">{rec.suggestion || rec.recommendation}</div>
                    <div className="text-gray-600 text-xs mt-1">{rec.reason || rec.description}</div>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 p-2">No recommendations available yet</div>
                )}
              </div>
            </div>

            {/* Flow Analysis */}
            <div>
              <h4 className="font-medium mb-2">Flow Analysis</h4>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {analysis?.flow_analysis || "Flow analysis not available"}
              </div>
            </div>

            {/* Bias Check */}
            <div>
              <h4 className="font-medium mb-2">Bias Assessment</h4>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {analysis?.bias_check || "Bias assessment not available"}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Analyze Survey" to get AI-powered insights about your survey structure and quality.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
