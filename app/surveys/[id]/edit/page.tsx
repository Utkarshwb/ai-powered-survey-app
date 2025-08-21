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
    <div className="min-h-screen w-full bg-white dark:bg-black relative">
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background: "#ffffff",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      
      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      <div className="relative z-10">
        <SurveyBuilder
          userId={data.user.id}
          surveyId={params.id}
          initialSurvey={survey}
          initialQuestions={questions || []}
        />
      </div>
    </div>
  )
}
