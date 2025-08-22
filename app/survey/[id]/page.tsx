import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SurveyResponse } from "@/components/survey-response/survey-response"

interface SurveyPageProps {
  params: Promise<{ id: string }>
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { id } = await params
  const supabase = await createClient()

  try {
    // Fetch survey data (no auth required for public surveys)
    const { data: survey, error: surveyError } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single()

    if (surveyError || !survey) {
      redirect("/survey-not-found")
    }

    // Fetch questions
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", id)
      .order("order_index")

    const validQuestions = questionsError ? [] : questions || []

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SurveyResponse survey={survey} questions={validQuestions} />
      </div>
    )
  } catch (error) {
    console.error("Error loading survey:", error)
    redirect("/survey-not-found")
  }
}
