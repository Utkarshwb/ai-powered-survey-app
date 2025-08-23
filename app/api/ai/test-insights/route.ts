import { type NextRequest, NextResponse } from "next/server"
import { generateSurveyInsights } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Test insights endpoint hit...")
    
    const { survey, questions, responses, sessions, hasResponses } = await request.json()
    
    console.log("📝 Insights request data:", { 
      surveyTitle: survey?.title, 
      questionsCount: questions?.length, 
      responsesCount: responses?.length,
      hasResponses
    })

    if (!survey || !questions) {
      return NextResponse.json({ error: "Missing required data (survey and questions)" }, { status: 400 })
    }

    // Generate insights using AI - pass responses array even if empty
    console.log("🤖 Calling generateSurveyInsights...")
    const result = await generateSurveyInsights(responses || [], questions)
    
    console.log("📊 Insights result:", result.success ? "✅ Success" : "❌ Failed", result.error || "")

    if (!result.success) {
      console.error("❌ Insights generation failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    console.log("✅ Insights generation successful")
    return NextResponse.json({ success: true, insights: result.insights })
  } catch (error) {
    console.error("💥 Error in test insights endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
