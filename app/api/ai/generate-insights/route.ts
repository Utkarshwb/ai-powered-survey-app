import { type NextRequest, NextResponse } from "next/server"
import { generateSurveyInsights } from "@/lib/gemini"
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

    const { survey, questions, responses, sessions, hasResponses } = await request.json()

    if (!survey || !questions) {
      return NextResponse.json({ error: "Missing required data (survey and questions)" }, { status: 400 })
    }

    // Generate insights using AI - pass responses array even if empty
    const result = await generateSurveyInsights(responses || [], questions)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ insights: result.insights })
  } catch (error) {
    console.error("Error in generate-insights API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
