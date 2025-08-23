import { type NextRequest, NextResponse } from "next/server"
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

    const { surveyId, format = "questions" } = await request.json()

    if (!surveyId) {
      return NextResponse.json({ error: "Survey ID is required" }, { status: 400 })
    }

    // Verify survey ownership
    const { data: survey } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", surveyId)
      .eq("user_id", user.id)
      .single()

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 })
    }

    // Fetch questions
    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index")

    // Fetch sessions and responses
    const { data: sessions } = await supabase
      .from("survey_sessions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("created_at", { ascending: false })

    const { data: responses } = await supabase
      .from("responses")
      .select(`
        *,
        survey_sessions!inner(survey_id)
      `)
      .eq("survey_sessions.survey_id", surveyId)

    // Group responses by session_id to handle cases where sessions might be missing
    const responsesBySession = responses?.reduce((acc: any, response: any) => {
      const sessionId = response.session_id
      if (!acc[sessionId]) {
        acc[sessionId] = []
      }
      acc[sessionId].push(response)
      return acc
    }, {}) || {}

    let csvContent = ""

    // Generate CSV format optimized for AI training
    const headers = [
      "Response ID",
      "Submitted At", 
      "Completion Time",
      "Email",
      ...(questions?.map((q: any) => `Q${q.order_index + 1}: ${q.question_text}`) || []),
    ]

    csvContent = headers.join(",") + "\n"

    // If we have sessions, use them. Otherwise, use response groups
    const sessionsToProcess = (sessions && sessions.length > 0) ? sessions : Object.keys(responsesBySession).map(sessionId => ({
      id: sessionId,
      completed_at: responsesBySession[sessionId][0]?.created_at || new Date().toISOString(),
      started_at: null,
      respondent_email: null
    }))

    sessionsToProcess?.forEach((session: any) => {
      const sessionResponses = (sessions && sessions.length > 0)
        ? responses?.filter((r: any) => r.session_id === session.id) || []
        : responsesBySession[session.id] || []
      
      const completionTime =
        session.started_at && session.completed_at
          ? Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 1000)
          : ""

      const row = [
        session.id.slice(-8),
        new Date(session.completed_at).toISOString(),
        completionTime ? `${completionTime}s` : "",
        session.respondent_email || "",
        ...(questions?.map((question: any) => {
          const response = sessionResponses.find((r: any) => r.question_id === question.id)
          const responseValue = response ? (() => {
            switch (question.question_type) {
              case "rating":
              case "scale":
                return response.answer_number || ""
              case "yes_no":
                return response.answer_boolean ? "Yes" : "No"
              case "number":
                return response.answer_number || ""
              default:
                // For text responses, clean and escape properly
                const text = response.answer_text || ""
                return `"${text.replace(/"/g, '""')}"`
            }
          })() : ""
          
          return responseValue
        }) || []),
      ]

      csvContent += row.join(",") + "\n"
    })

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${survey.title.replace(/[^a-zA-Z0-9]/g, "_")}_survey_data.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting CSV:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
