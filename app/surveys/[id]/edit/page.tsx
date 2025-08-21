import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SurveyBuilder } from "@/components/survey-builder/survey-builder"

interface EditSurveyPageProps {
  params: { id: string }
}

export default async function EditSurveyPage({ params }: EditSurveyPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch survey data
  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (!survey) {
    redirect("/dashboard")
  }

  // Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", params.id)
    .order("order_index")

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyBuilder
        userId={data.user.id}
        surveyId={params.id}
        initialSurvey={survey}
        initialQuestions={questions || []}
      />
    </div>
  )
}
