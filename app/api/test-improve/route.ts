import { NextResponse } from "next/server"
import { improveSurveyQuestion } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const { questionText, context } = await request.json()

    if (!questionText) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 })
    }

    console.log('Testing AI improve with:', { questionText, context })

    // Test AI improvement without authentication for debugging
    const result = await improveSurveyQuestion(questionText, context)

    console.log('AI improvement result:', result)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ improvements: result.improvements })
  } catch (error) {
    console.error("Error in test-improve API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
