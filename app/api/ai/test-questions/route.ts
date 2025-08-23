import { type NextRequest, NextResponse } from "next/server"
import { generateSurveyQuestions } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Test endpoint hit - testing AI question generation...")
    
    const { prompt, surveyType } = await request.json()
    
    console.log("📝 Request data:", { prompt, surveyType })

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate questions using AI
    console.log("🤖 Calling generateSurveyQuestions...")
    const result = await generateSurveyQuestions(prompt, surveyType)
    
    console.log("📊 AI Result:", result)

    if (!result.success) {
      console.error("❌ AI generation failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    console.log("✅ AI generation successful, returning questions")
    return NextResponse.json({ questions: result.questions, success: true })
  } catch (error) {
    console.error("💥 Error in test endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
