import { type NextRequest, NextResponse } from "next/server"
import { analyzeSurveyStructure } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { surveyId } = await request.json()

    if (!surveyId) {
      return NextResponse.json({ error: "Survey ID is required" }, { status: 400 })
    }

    // Fetch survey and questions
    const { data: survey } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", surveyId)
      .eq("user_id", user.id)
      .single()

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 })
    }

    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index")

    // Analyze survey structure using AI
    const result = await analyzeSurveyStructure(survey, questions || [])

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ analysis: result.analysis })
  } catch (error) {
    console.error("Error in analyze-survey API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
