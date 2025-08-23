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
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index")

    // Fetch sessions and responses
    const { data: sessions, error: sessionsError } = await supabase
      .from("survey_sessions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("created_at", { ascending: false })

    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select(`
        *,
        survey_sessions!inner(survey_id)
      `)
      .eq("survey_sessions.survey_id", surveyId)

    // Debug logging for production issues
    console.log("Production Debug - Survey ID:", surveyId)
    console.log("Questions found:", questions?.length || 0, questionsError ? "Error: " + questionsError.message : "")
    console.log("Sessions found:", sessions?.length || 0, sessionsError ? "Error: " + sessionsError.message : "")
    console.log("Responses found:", responses?.length || 0, responsesError ? "Error: " + responsesError.message : "")
    
    if (questionsError) console.error("Questions error:", questionsError)
    if (sessionsError) console.error("Sessions error:", sessionsError)
    if (responsesError) console.error("Responses error:", responsesError)

    // Try alternative response query if the join fails
    let alternativeResponses = null
    if (!responses || responses.length === 0) {
      console.log("Trying alternative response query...")
      const { data: altResponses, error: altError } = await supabase
        .from("responses")
        .select("*")
      
      if (altResponses) {
        // Filter responses manually by matching session IDs
        const sessionIds = sessions?.map(s => s.id) || []
        alternativeResponses = altResponses.filter(r => sessionIds.includes(r.session_id))
        console.log("Alternative responses found:", alternativeResponses.length)
      }
      
      if (altError) {
        console.error("Alternative response query error:", altError)
      }
      
      // Last resort: try to get responses for any session in this survey
      if (!alternativeResponses || alternativeResponses.length === 0) {
        console.log("Trying to find responses by question survey_id...")
        const questionIds = questions?.map(q => q.id) || []
        if (questionIds.length > 0) {
          const { data: responsesByQuestions } = await supabase
            .from("responses")
            .select("*")
            .in("question_id", questionIds)
          
          alternativeResponses = responsesByQuestions || []
          console.log("Responses by questions found:", alternativeResponses.length)
        }
      }
    }

    const finalResponses = responses?.length ? responses : alternativeResponses
    
    console.log("Final responses to use:", finalResponses?.length || 0)
    
    const responsesBySession = finalResponses?.reduce((acc: any, response: any) => {
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
        ? finalResponses?.filter((r: any) => r.session_id === session.id) || []
        : responsesBySession[session.id] || []
      
      console.log(`Processing session ${session.id.slice(-8)}: ${sessionResponses.length} responses`)
      
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
