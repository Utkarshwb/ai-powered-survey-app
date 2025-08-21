import { type NextRequest, NextResponse } from "next/server"
import { improveSurveyQuestion } from "@/lib/gemini"
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

    const { questionText, context } = await request.json()

    if (!questionText) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 })
    }

    // Improve question using AI
    const result = await improveSurveyQuestion(questionText, context)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ improvements: result.improvements })
  } catch (error) {
    console.error("Error in improve-question API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
