"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle } from "lucide-react"

interface QuestionImproverProps {
  questionText: string
  context?: string
  onImprovement: (improvedText: string) => void
}

export function QuestionImprover({ questionText, context, onImprovement }: QuestionImproverProps) {
  const [improvements, setImprovements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleImprove = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/improve-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, context }),
      })

      const data = await response.json()
      if (data.improvements) {
        setImprovements(data.improvements)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error improving question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseImprovement = (improvedText: string) => {
    onImprovement(improvedText)
    setShowSuggestions(false)
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
