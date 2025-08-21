"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, X, Loader2 } from "lucide-react"
import { generateSurveyQuestions } from "@/lib/gemini"
import type { Question } from "@/lib/types"

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: Partial<Question>[]) => void
  onClose: () => void
}

export function AIQuestionGenerator({ onQuestionsGenerated, onClose }: AIQuestionGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [surveyType, setSurveyType] = useState("general")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Partial<Question>[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await generateSurveyQuestions(prompt, surveyType)

      if (result.success && result.questions) {
        setGeneratedQuestions(result.questions)
      } else {
        console.error("Failed to generate questions:", result.error)
      }
    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseQuestions = () => {
    onQuestionsGenerated(generatedQuestions)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Question Generator</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt">Describe your survey</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Customer satisfaction survey for a restaurant, Employee feedback survey, Product research for a mobile app..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="survey-type">Survey Type</Label>
          <Select value={surveyType} onValueChange={setSurveyType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="customer_satisfaction">Customer Satisfaction</SelectItem>
              <SelectItem value="employee_feedback">Employee Feedback</SelectItem>
              <SelectItem value="product_research">Product Research</SelectItem>
              <SelectItem value="market_research">Market Research</SelectItem>
              <SelectItem value="event_feedback">Event Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Questions
            </>
          )}
        </Button>

        {/* Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Generated Questions:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{question.question_text}</div>
                  <div className="text-gray-600 text-xs mt-1">
                    Type: {question.question_type}
                    {question.options && ` • Options: ${question.options.join(", ")}`}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleUseQuestions} className="w-full">
              Add These Questions to Survey
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
