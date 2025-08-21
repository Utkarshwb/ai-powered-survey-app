import { type NextRequest, NextResponse } from "next/server"
import { generateSurveyQuestions } from "@/lib/gemini"
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

    const { prompt, surveyType, surveyId } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate questions using AI
    const result = await generateSurveyQuestions(prompt, surveyType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Save AI suggestion to database if surveyId is provided
    if (surveyId && result.questions) {
      await supabase.from("ai_suggestions").insert({
        survey_id: surveyId,
        suggested_questions: result.questions,
        prompt_used: prompt,
      })
    }

    return NextResponse.json({ questions: result.questions })
  } catch (error) {
    console.error("Error in generate-questions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
