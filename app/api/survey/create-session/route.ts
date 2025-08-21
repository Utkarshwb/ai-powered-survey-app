import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { surveyId, respondentEmail, userAgent } = await request.json()

    if (!surveyId) {
      return NextResponse.json({ error: "Survey ID is required" }, { status: 400 })
    }

    // Verify survey exists and is published
    const { data: survey } = await supabase
      .from("surveys")
      .select("id, is_published")
      .eq("id", surveyId)
      .eq("is_published", true)
      .single()

    if (!survey) {
      return NextResponse.json({ error: "Survey not found or not published" }, { status: 404 })
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")

    // Create survey session
    const { data: session, error } = await supabase
      .from("survey_sessions")
      .insert({
        survey_id: surveyId,
        respondent_email: respondentEmail,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating session:", error)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error in create-session API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
