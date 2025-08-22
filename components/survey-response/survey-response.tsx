"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { QuestionRenderer } from "./question-renderer"
import type { Survey, Question } from "@/lib/types"

interface SurveyResponseProps {
  survey: Survey
  questions: Question[]
}

export function SurveyResponse({ survey, questions }: SurveyResponseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const router = useRouter()

  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null
  const progress = questions && questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  const isLastQuestion = questions && questions.length > 0 ? currentQuestionIndex === questions.length - 1 : false
  const isFirstQuestion = currentQuestionIndex === 0

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const canProceed = () => {
    if (!currentQuestion) return false

    const response = responses[currentQuestion.id]

    if (currentQuestion.is_required) {
      if (currentQuestion.question_type === "multiple_choice") {
        return response && response.length > 0
      }
      return response !== undefined && response !== null && response !== ""
    }

    return true
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Create survey session
      const sessionResponse = await fetch("/api/survey/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          userAgent: navigator.userAgent,
        }),
      })

      const sessionData = await sessionResponse.json()
      const newSessionId = sessionData.sessionId

      // Submit all responses
      const responsePromises = questions.map((question) => {
        const response = responses[question.id]
        if (response === undefined || response === null || response === "") return null

        return fetch("/api/survey/submit-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: newSessionId,
            questionId: question.id,
            response: response,
            questionType: question.question_type,
          }),
        })
      })

      await Promise.all(responsePromises.filter(Boolean))

      // Mark session as completed
      await fetch("/api/survey/complete-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId }),
      })

      // Check if user provided email and send feedback
      const emailResponse = findEmailInResponses()
      if (emailResponse) {
        try {
          console.log('📧 Sending survey feedback email to:', emailResponse.email)
          
          // Prepare answers array for AI analysis
          const answersForAI = questions.map((question) => ({
            question: question.question_text,
            answer: responses[question.id] || 'No answer provided',
            type: question.question_type
          }))

          await fetch("/api/send-survey-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailResponse.email,
              userName: emailResponse.userName,
              surveyId: survey.id,
              surveyTitle: survey.title,
              answers: answersForAI
            }),
          })
          
          console.log('✅ Survey feedback email sent successfully')
        } catch (emailError) {
          console.error('❌ Failed to send survey feedback email:', emailError)
          // Don't block survey submission if email fails
        }
      }

      router.push(`/survey/${survey.id}/thank-you?sessionId=${newSessionId}`)
    } catch (error) {
      console.error("Error submitting survey:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to find email in responses
  const findEmailInResponses = () => {
    for (const question of questions) {
      const response = responses[question.id]
      if (response && typeof response === 'string') {
        // Check if response looks like an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(response.trim())) {
          // Try to extract name from previous question
          const questionIndex = questions.findIndex(q => q.id === question.id)
          let userName = 'Survey Participant'
          
          // Look for name in previous questions
          if (questionIndex > 0) {
            const prevResponse = responses[questions[questionIndex - 1].id]
            if (prevResponse && typeof prevResponse === 'string' && 
                prevResponse.length > 0 && prevResponse.length < 100 &&
                !emailRegex.test(prevResponse)) {
              userName = prevResponse.trim()
            }
          }
          
          return {
            email: response.trim(),
            userName
          }
        }
      }
    }
    return null
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>This survey doesn&apos;t have any questions yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Survey Error</CardTitle>
            <CardDescription>Unable to load survey questions. Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-700">Survey</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
        {survey.description && <p className="text-gray-600 max-w-lg mx-auto">{survey.description}</p>}
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-relaxed">{currentQuestion.question_text}</CardTitle>
              {currentQuestion.is_required && <span className="text-red-500 text-sm">* Required</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QuestionRenderer
            question={currentQuestion}
            value={responses[currentQuestion.id]}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Survey
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Your responses are secure and will be used only for the stated purpose of this survey.</p>
      </div>
    </div>
  )
}
