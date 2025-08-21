import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { sessionId, questionId, response, questionType } = await request.json()

    if (!sessionId || !questionId) {
      return NextResponse.json({ error: "Session ID and Question ID are required" }, { status: 400 })
    }

    // Verify session exists
    const { data: session } = await supabase.from("survey_sessions").select("id").eq("id", sessionId).single()

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Prepare response data based on question type
    const responseData: any = {
      session_id: sessionId,
      question_id: questionId,
    }

    switch (questionType) {
      case "number":
      case "rating":
        responseData.answer_number = Number.parseFloat(response)
        break
      case "yes_no":
        responseData.answer_boolean = response === "yes"
        break
      default:
        responseData.answer_text = response?.toString()
    }

    // Insert response
    const { error } = await supabase.from("responses").insert(responseData)

    if (error) {
      console.error("Error inserting response:", error)
      return NextResponse.json({ error: "Failed to save response" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in submit-response API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
