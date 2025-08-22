import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateSurveyFeedbackEmail } from '@/lib/ai-email-generator'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email,
      userName,
      surveyId,
      answers,
      surveyTitle
    } = body

    // Validate required fields
    if (!email || !surveyId || !answers) {
      return NextResponse.json(
        { error: 'Email, survey ID, and answers are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get survey details
    const { data: survey } = await supabase
      .from('surveys')
      .select('title, description')
      .eq('id', surveyId)
      .single()

    // Get questions for context
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId)
      .order('order_index')

    // Generate AI feedback email based on survey answers
    const emailData = await generateSurveyFeedbackEmail({
      userName: userName || 'Valued Participant',
      email,
      surveyTitle: survey?.title || surveyTitle || 'Survey',
      surveyDescription: survey?.description || '',
      questions: questions || [],
      answers
    })

    // Send the email
    const emailResult = await resend.emails.send({
      from: 'FormWise AI <onboarding@resend.dev>',
      to: [email],
      subject: emailData.subject,
      html: emailData.content
    })

    // Log success
    console.log('✅ Survey feedback email sent:', {
      email,
      surveyId,
      surveyTitle: survey?.title,
      emailId: emailResult.data?.id
    })

    return NextResponse.json({
      success: true,
      message: 'Survey feedback email sent successfully!',
      emailId: emailResult.data?.id,
      insights: emailData.insights
    })

  } catch (error) {
    console.error('❌ Error sending survey feedback email:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send survey feedback email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Survey feedback email API endpoint',
    usage: 'Send POST request with { email, surveyId, answers, userName?, surveyTitle? }'
  })
}
