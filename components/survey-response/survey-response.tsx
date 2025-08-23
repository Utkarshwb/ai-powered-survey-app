"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight, Send, Save, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { QuestionRenderer } from "./question-renderer"
import { ProgressHeader } from "@/components/ui/progress-indicators"
import { useSwipeGesture, useKeyboardShortcuts, useIsMobile } from "@/hooks/use-gestures"
import { MobileFloatingActionButton } from "@/components/ui/mobile-components"
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const router = useRouter()
  const isMobile = useIsMobile()

  // Swipe gesture setup
  const swipeGesture = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setQuestionStartTime(Date.now())
      }
    },
    onSwipeRight: () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
        setQuestionStartTime(Date.now())
      }
    },
    threshold: 75
  })

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'ArrowLeft', callback: () => {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1)
          setQuestionStartTime(Date.now())
        }
      }
    },
    { key: 'ArrowRight', callback: () => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setQuestionStartTime(Date.now())
        }
      }
    },
    { key: 'Enter', callback: () => {
        if (currentQuestionIndex === questions.length - 1) {
          handleSubmit()
        } else if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setQuestionStartTime(Date.now())
        }
      }
    }
  ])

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${survey.id}`)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        // Only restore if saved less than 24 hours ago
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          setResponses(draft.responses || {})
          setCurrentQuestionIndex(draft.currentQuestionIndex || 0)
          setLastSaved(new Date(draft.timestamp))
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [survey.id])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (Object.keys(responses).length === 0) return
    
    const interval = setInterval(() => {
      const draft = {
        responses,
        currentQuestionIndex,
        timestamp: Date.now()
      }
      localStorage.setItem(`draft_${survey.id}`, JSON.stringify(draft))
      setLastSaved(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [responses, currentQuestionIndex, survey.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return // Don't interfere with form inputs
      }
      
      if (e.key === 'ArrowRight' && !isLastQuestion && canProceed()) {
        handleNext()
      }
      if (e.key === 'ArrowLeft' && !isFirstQuestion) {
        handlePrevious()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestionIndex, responses])

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

  const canProceed = useCallback(() => {
    if (!currentQuestion) return false

    const response = responses[currentQuestion.id]

    if (currentQuestion.is_required) {
      if (currentQuestion.question_type === "multiple_choice") {
        return response && response.length > 0
      }
      return response !== undefined && response !== null && response !== ""
    }

    return true
  }, [currentQuestion, responses])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionStartTime(Date.now())
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const timeSpentOnQuestion = useMemo(() => {
    return Date.now() - questionStartTime
  }, [questionStartTime])

  // Clear draft when survey is submitted
  const clearDraft = () => {
    localStorage.removeItem(`draft_${survey.id}`)
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

      // Submit all responses with time tracking
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
            timeSpent: timeSpentOnQuestion // Track time spent
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

      // Clear draft on successful submission
      clearDraft()

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
      alert('Failed to submit survey. Please try again.')
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
            {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Brain className="h-4 w-4" />
          AI-Powered Survey
        </div>
      </div>

      {/* Progress */}
      <ProgressHeader 
        current={currentQuestionIndex + 1}
        total={questions.length}
        estimatedTimeMinutes={Math.ceil(questions.length * 1.5)} // Estimate 1.5 min per question
        title={survey.title}
      />

      {/* Survey Description */}
      {survey.description && (
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{survey.description}</p>
        </div>
      )}

      {/* Auto-save Status */}
      {lastSaved && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
          <Save className="h-4 w-4" />
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}

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

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Use ← → keys to navigate</span>
        </div>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Submitting...
              </>
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
        <p>Your responses are secure and automatically saved every 30 seconds.</p>
        {currentQuestion.is_required && <p>* Required fields must be completed to proceed.</p>}
      </div>
    </div>
  )
}
