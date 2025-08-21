"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { Brain, Save, Eye, ArrowLeft, Plus, Sparkles, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QuestionBuilder } from "./question-builder"
import { AIQuestionGenerator } from "./ai-question-generator"
import { SurveyAnalyzer } from "./survey-analyzer"
import type { Survey, Question } from "@/lib/types"

interface SurveyBuilderProps {
  userId: string
  surveyId?: string
  initialSurvey?: Survey
  initialQuestions?: Question[]
}

export function SurveyBuilder({ userId, surveyId, initialSurvey, initialQuestions = [] }: SurveyBuilderProps) {
  const [title, setTitle] = useState(initialSurvey?.title || "")
  const [description, setDescription] = useState(initialSurvey?.description || "")
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [isPublished, setIsPublished] = useState(initialSurvey?.is_published || false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const [needsDbSetup, setNeedsDbSetup] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    if (!title.trim()) return

    setIsSaving(true)
    setDbError(null)
    setNeedsDbSetup(false)

    console.log("[v0] Starting survey save process...")

    try {
      let currentSurveyId = surveyId

      if (surveyId) {
        console.log("[v0] Updating existing survey:", surveyId)
        const { error: updateError } = await supabase
          .from("surveys")
          .update({
            title,
            description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", surveyId)

        if (updateError) throw updateError
      } else {
        console.log("[v0] Creating new survey...")
        const { data: newSurvey, error } = await supabase
          .from("surveys")
          .insert({
            title,
            description,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error
        currentSurveyId = newSurvey.id
        console.log("[v0] Created new survey with ID:", currentSurveyId)
      }

      if (currentSurveyId) {
        console.log("[v0] Deleting existing questions...")
        const { error: deleteError } = await supabase.from("questions").delete().eq("survey_id", currentSurveyId)

        if (deleteError) throw deleteError

        if (questions.length > 0) {
          console.log("[v0] Inserting", questions.length, "questions...")
          const questionsToInsert = questions.map((q, index) => ({
            survey_id: currentSurveyId,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            is_required: q.is_required,
            order_index: index,
          }))

          const { error: insertError } = await supabase.from("questions").insert(questionsToInsert)

          if (insertError) throw insertError
        }
      }

      if (!surveyId && currentSurveyId) {
        router.push(`/surveys/${currentSurveyId}/edit`)
      }

      console.log("[v0] Survey saved successfully")
    } catch (error: any) {
      console.error("[v0] Error saving survey:", error)

      const errorMessage = error?.message || ""
      const isTableMissingError =
        errorMessage.includes("Could not find the table") ||
        errorMessage.includes("schema cache") ||
        (errorMessage.includes("relation") && errorMessage.includes("does not exist")) ||
        errorMessage.includes("public.surveys") ||
        errorMessage.includes("public.questions") ||
        errorMessage.includes("public.responses") ||
        error?.code === "42P01" || // PostgreSQL table does not exist error code
        error?.code === "PGRST116" // PostgREST table not found

      if (isTableMissingError) {
        console.log("[v0] Database tables missing - showing setup guide")
        setNeedsDbSetup(true)
        setDbError("Database tables need to be set up first. Please run the SQL scripts below.")
      } else {
        setDbError(`Error saving survey: ${errorMessage || "Unknown error"}`)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    await handleSave()

    if (surveyId) {
      await supabase.from("surveys").update({ is_published: !isPublished }).eq("id", surveyId)

      setIsPublished(!isPublished)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      survey_id: surveyId || "",
      question_text: "",
      question_type: "text",
      is_required: false,
      order_index: questions.length,
      created_at: new Date().toISOString(),
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updatedQuestion: Partial<Question>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion }
    setQuestions(newQuestions)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleAIQuestions = (aiQuestions: Partial<Question>[]) => {
    const newQuestions = aiQuestions.map((q, index) => ({
      id: `temp-${Date.now()}-${index}`,
      survey_id: surveyId || "",
      question_text: q.question_text || "",
      question_type: q.question_type || "text",
      options: q.options,
      is_required: q.is_required || false,
      order_index: questions.length + index,
      created_at: new Date().toISOString(),
    })) as Question[]

    setQuestions([...questions, ...newQuestions])
    setShowAIGenerator(false)
  }

  const handleDatabaseSetupComplete = () => {
    setNeedsDbSetup(false)
    setDbError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">{surveyId ? "Edit Survey" : "Create New Survey"}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPublished && <Badge variant="default">Published</Badge>}
          <Button variant="outline" onClick={handleSave} disabled={isSaving || needsDbSetup}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {surveyId && (
            <Button onClick={handlePublish} disabled={needsDbSetup}>
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}
        </div>
      </div>

      {needsDbSetup && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="space-y-3">
              <p className="font-medium text-lg">⚠️ Database Setup Required</p>
              <p>The database tables don't exist yet. You need to run the SQL scripts to create them:</p>
              <div className="bg-white p-3 rounded border text-sm font-mono">
                <p className="font-semibold mb-2">Run these scripts in order:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>scripts/001_create_surveys_table.sql</li>
                  <li>scripts/002_create_questions_table.sql</li>
                  <li>scripts/003_create_responses_table.sql</li>
                  <li>scripts/004_create_ai_suggestions_table.sql</li>
                  <li>scripts/005_create_survey_sessions_table.sql</li>
                </ol>
              </div>
              <p className="text-sm">
                💡 <strong>Tip:</strong> Look for the "Run Script" buttons in the v0 interface to execute these scripts.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {dbError && !needsDbSetup && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <p className="font-medium">Error</p>
            <p>{dbError}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card className="border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Survey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Survey Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={needsDbSetup ? "Run database scripts first..." : "Enter survey title..."}
                disabled={needsDbSetup}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={needsDbSetup ? "Run database scripts first..." : "Describe what this survey is about..."}
                rows={3}
                disabled={needsDbSetup}
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {showAIGenerator && !needsDbSetup && (
          <AIQuestionGenerator onQuestionsGenerated={handleAIQuestions} onClose={() => setShowAIGenerator(false)} />
        )}

        <Card className="border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">Questions</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAIGenerator(true)}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={needsDbSetup}
                >
                  <Sparkles className="h-4 w-4" />
                  AI Generate
                </Button>
                <Button onClick={addQuestion} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl" disabled={needsDbSetup}>
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {needsDbSetup ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500 dark:text-amber-400" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">Database Setup Required</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Please run the SQL scripts above to enable survey creation.</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No questions yet. Add your first question or use AI to generate them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionBuilder
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                    onDelete={() => deleteQuestion(index)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {surveyId && questions.length > 0 && <SurveyAnalyzer surveyId={surveyId} />}

        {surveyId && isPublished && (
          <Card>
            <CardHeader>
              <CardTitle>Share Your Survey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Survey Link</Label>
                  <Input value={`${window.location.origin}/survey/${surveyId}`} readOnly className="bg-gray-50" />
                </div>
                <Link href={`/survey/${surveyId}`} target="_blank">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
