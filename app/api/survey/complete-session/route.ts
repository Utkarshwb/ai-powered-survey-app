import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Update session as completed
    const { error } = await supabase
      .from("survey_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", sessionId)

    if (error) {
      console.error("Error completing session:", error)
      return NextResponse.json({ error: "Failed to complete session" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in complete-session API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
