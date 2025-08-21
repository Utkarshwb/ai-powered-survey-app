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

    const { surveyId, format = "responses" } = await request.json()

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
      .eq("completed_at", "not.null")
      .order("completed_at", { ascending: false })

    const { data: responses } = await supabase
      .from("responses")
      .select(`
        *,
        survey_sessions!inner(survey_id)
      `)
      .eq("survey_sessions.survey_id", surveyId)

    let csvContent = ""

    if (format === "responses") {
      // Generate responses CSV
      const headers = [
        "Response ID",
        "Submitted At",
        "Completion Time",
        "Email",
        ...(questions?.map((q) => `Q${q.order_index + 1}: ${q.question_text}`) || []),
      ]

      csvContent = headers.join(",") + "\n"

      sessions?.forEach((session) => {
        const sessionResponses = responses?.filter((r) => r.session_id === session.id) || []
        const completionTime =
          session.started_at && session.completed_at
            ? Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 1000)
            : ""

        const row = [
          session.id.slice(-8),
          new Date(session.completed_at).toISOString(),
          completionTime ? `${completionTime}s` : "",
          session.respondent_email || "",
          ...(questions?.map((question) => {
            const response = sessionResponses.find((r) => r.question_id === question.id)
            if (!response) return ""

            switch (question.question_type) {
              case "rating":
                return response.answer_number || ""
              case "yes_no":
                return response.answer_boolean ? "Yes" : "No"
              case "number":
                return response.answer_number || ""
              default:
                return `"${(response.answer_text || "").replace(/"/g, '""')}"` // Escape quotes
            }
          }) || []),
        ]

        csvContent += row.join(",") + "\n"
      })
    } else if (format === "summary") {
      // Generate summary CSV
      csvContent = "Question,Type,Total Responses,Response Rate\n"

      questions?.forEach((question) => {
        const questionResponses = responses?.filter((r) => r.question_id === question.id) || []
        const responseRate = sessions?.length ? (questionResponses.length / sessions.length) * 100 : 0

        csvContent +=
          [
            `"${question.question_text.replace(/"/g, '""')}"`,
            question.question_type,
            questionResponses.length,
            `${Math.round(responseRate)}%`,
          ].join(",") + "\n"
      })
    }

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${survey.title.replace(/[^a-zA-Z0-9]/g, "_")}_${format}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting CSV:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
