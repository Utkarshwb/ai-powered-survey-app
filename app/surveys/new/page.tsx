import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SurveyBuilder } from "@/components/survey-builder/survey-builder"

export default async function NewSurveyPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyBuilder userId={data.user.id} />
    </div>
  )
}
