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

    const { surveyId } = await request.json()

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

    // Fetch data for report
    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index")

    const { data: sessions } = await supabase.from("survey_sessions").select("*").eq("survey_id", surveyId)

    const { data: responses } = await supabase
      .from("responses")
      .select(`
        *,
        survey_sessions!inner(survey_id)
      `)
      .eq("survey_sessions.survey_id", surveyId)

    const completedSessions = sessions?.filter((s) => s.completed_at) || []
    const completionRate = sessions?.length ? (completedSessions.length / sessions.length) * 100 : 0

    // Generate HTML report
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Survey Report - ${survey.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #3b82f6; font-size: 28px; margin: 0; }
        .subtitle { color: #666; font-size: 14px; margin: 5px 0; }
        .stats { display: flex; gap: 30px; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { font-size: 12px; color: #666; }
        .question { margin: 30px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .question-title { font-weight: bold; margin-bottom: 10px; }
        .question-type { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .response-summary { margin: 15px 0; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${survey.title}</h1>
        <p class="subtitle">${survey.description || "No description provided"}</p>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-number">${completedSessions.length}</div>
            <div class="stat-label">Total Responses</div>
        </div>
        <div class="stat">
            <div class="stat-number">${Math.round(completionRate)}%</div>
            <div class="stat-label">Completion Rate</div>
        </div>
        <div class="stat">
            <div class="stat-number">${questions?.length || 0}</div>
            <div class="stat-label">Questions</div>
        </div>
        <div class="stat">
            <div class="stat-number">${responses?.length || 0}</div>
            <div class="stat-label">Total Answers</div>
        </div>
    </div>

    <h2>Question Analysis</h2>
    ${
      questions
        ?.map((question) => {
          const questionResponses = responses?.filter((r) => r.question_id === question.id) || []
          const responseRate =
            completedSessions.length > 0 ? (questionResponses.length / completedSessions.length) * 100 : 0

          let analysisContent = ""

          if (question.question_type === "multiple_choice" && question.options) {
            const optionCounts = question.options.reduce((acc: any, option: string) => {
              acc[option] = questionResponses.filter((r) => r.answer_text === option).length
              return acc
            }, {})

            analysisContent = Object.entries(optionCounts)
              .map(([option, count]) => `<li>${option}: ${count} responses</li>`)
              .join("")
            analysisContent = `<ul>${analysisContent}</ul>`
          } else if (question.question_type === "rating") {
            const ratings = questionResponses.map((r) => r.answer_number).filter((n) => n !== null)
            const avgRating =
              ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A"
            analysisContent = `<p>Average Rating: ${avgRating}/5 (${ratings.length} responses)</p>`
          } else if (question.question_type === "yes_no") {
            const yesCount = questionResponses.filter((r) => r.answer_boolean === true).length
            const noCount = questionResponses.filter((r) => r.answer_boolean === false).length
            analysisContent = `<p>Yes: ${yesCount} | No: ${noCount}</p>`
          } else {
            analysisContent = `<p>${questionResponses.length} text responses received</p>`
          }

          return `
        <div class="question">
            <div class="question-title">
                Question ${question.order_index + 1}: ${question.question_text}
                <span class="question-type">${question.question_type.replace("_", " ")}</span>
            </div>
            <div class="response-summary">
                <strong>Response Rate:</strong> ${Math.round(responseRate)}% (${questionResponses.length}/${completedSessions.length})
                ${analysisContent}
            </div>
        </div>
      `
        })
        .join("") || "<p>No questions found.</p>"
    }

    <div class="footer">
  <p>This report was generated by FormWise on ${new Date().toLocaleString()}</p>
        <p>Survey ID: ${survey.id}</p>
    </div>
</body>
</html>
    `

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${survey.title.replace(/[^a-zA-Z0-9]/g, "_")}_report.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF report:", error)
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 })
  }
}
