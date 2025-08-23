"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

interface QuestionImproverProps {
  questionText: string
  context?: string
  onImprovement: (improvedText: string) => void
}

export function QuestionImprover({ questionText, context, onImprovement }: QuestionImproverProps) {
  const [improvements, setImprovements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<any>(null)

  // Check AI status on mount
  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/ai/status')
      const status = await response.json()
      setAiStatus(status)
    } catch (error) {
      console.error('Failed to check AI status:', error)
    }
  }

  const handleImprove = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ai/improve-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, context }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve question')
      }
      
      if (data.improvements && data.improvements.length > 0) {
        setImprovements(data.improvements)
        setShowSuggestions(true)
      } else {
        setError('No improvements generated. Try rephrasing your question.')
      }
    } catch (error) {
      console.error("Error improving question:", error)
      setError(error instanceof Error ? error.message : 'Failed to improve question')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseImprovement = (improvedText: string) => {
    onImprovement(improvedText)
    setShowSuggestions(false)
  }

  useEffect(() => {
    checkAIStatus()
  }, [])

  // Don't show the button if AI is not enabled
  if (aiStatus && !aiStatus.aiEnabled) {
    return (
      <Alert className="mt-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          AI features are not available. Please configure GEMINI_API_KEY in your environment variables.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleImprove}
        disabled={isLoading || !questionText.trim()}
        className="flex items-center gap-2 bg-transparent"
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        {isLoading ? "Improving..." : "AI Improve"}
      </Button>

      {error && (
        <Alert className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showSuggestions && improvements.length > 0 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {improvements.map((improvement, index) => (
              <div key={index} className="space-y-2">
                <div className="p-3 bg-blue-50 rounded text-sm">
                  <div className="font-medium text-blue-900">{improvement.question}</div>
                  <div className="text-blue-700 text-xs mt-1">{improvement.reason}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseImprovement(improvement.question)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Use This Version
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
