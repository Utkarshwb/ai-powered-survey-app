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

    const { surveyId, includeMetadata = true } = await request.json()

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

    // Fetch all related data
    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index")

    const { data: sessions } = await supabase
      .from("survey_sessions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("started_at", { ascending: false })

    const { data: responses } = await supabase
      .from("responses")
      .select(`
        *,
        survey_sessions!inner(survey_id)
      `)
      .eq("survey_sessions.survey_id", surveyId)

    // Structure the data
    const exportData: any = {
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        is_published: survey.is_published,
        created_at: survey.created_at,
        updated_at: survey.updated_at,
      },
      questions:
        questions?.map((q) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          is_required: q.is_required,
          order_index: q.order_index,
        })) || [],
      responses:
        sessions?.map((session) => {
          const sessionResponses = responses?.filter((r) => r.session_id === session.id) || []

          return {
            session_id: session.id,
            started_at: session.started_at,
            completed_at: session.completed_at,
            respondent_email: session.respondent_email,
            completion_time_ms:
              session.started_at && session.completed_at
                ? new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()
                : null,
            answers: sessionResponses.map((response) => ({
              question_id: response.question_id,
              answer_text: response.answer_text,
              answer_number: response.answer_number,
              answer_boolean: response.answer_boolean,
              created_at: response.created_at,
            })),
          }
        }) || [],
    }

    if (includeMetadata) {
      exportData.metadata = {
        exported_at: new Date().toISOString(),
        total_sessions: sessions?.length || 0,
        completed_sessions: sessions?.filter((s) => s.completed_at).length || 0,
        total_responses: responses?.length || 0,
        completion_rate: sessions?.length ? (sessions.filter((s) => s.completed_at).length / sessions.length) * 100 : 0,
      }
    }

    const jsonContent = JSON.stringify(exportData, null, 2)

    return new Response(jsonContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${survey.title.replace(/[^a-zA-Z0-9]/g, "_")}_export.json"`,
      },
    })
  } catch (error) {
    console.error("Error exporting JSON:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
