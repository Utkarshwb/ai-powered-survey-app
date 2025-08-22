import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateSurveyFeedbackEmail } from '@/lib/ai-email-generator'
import { generatePersonalizedThankYou } from '@/lib/gemini'

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

    // Convert answers to response map for AI analysis
    const responseMap: Record<string, any> = {}
    if (questions) {
      questions.forEach((question, index) => {
        if (answers[index]) {
          responseMap[question.id] = answers[index].answer
        }
      })
    }

    // Generate personalized thank you message
    const personalizedThankYou = await generatePersonalizedThankYou(
      survey?.title || surveyTitle || 'Survey',
      questions || [],
      responseMap,
      userName
    )

    // Generate AI feedback email based on survey answers
    const emailData = await generateSurveyFeedbackEmail({
      userName: userName || 'Valued Participant',
      email,
      surveyTitle: survey?.title || surveyTitle || 'Survey',
      surveyDescription: survey?.description || '',
      questions: questions || [],
      answers
    })

    // Enhance email with personalized message if available
    let enhancedContent = emailData.content
    if (personalizedThankYou.success && personalizedThankYou.message) {
      const personalMsg = personalizedThankYou.message
      enhancedContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✨ ${personalMsg.subject}</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #333; margin-bottom: 15px;">${personalMsg.greeting}</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              ${personalMsg.main_message}
            </p>
            
            <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
              <p style="color: #4c51bf; margin: 0; font-weight: 600;">🎯 Your Impact:</p>
              <p style="color: #555; margin: 5px 0 0 0;">${personalMsg.impact_statement}</p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">📊 Your Personalized Insights:</h3>
              ${emailData.content}
            </div>
            
            <p style="color: #555; margin-bottom: 10px;">${personalMsg.closing}</p>
            <p style="color: #667eea; font-weight: 600;">${personalMsg.signature}</p>
          </div>
          
          <div style="background: #f8f9ff; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Want to create your own AI-powered surveys? <a href="https://formwise.ai" style="color: #667eea;">Try FormWise</a>
            </p>
          </div>
        </div>
      `
    }

    // Send the email
    const emailResult = await resend.emails.send({
      from: 'FormWise AI <onboarding@resend.dev>',
      to: [email],
      subject: personalizedThankYou.success ? personalizedThankYou.message.subject : emailData.subject,
      html: enhancedContent
    })

    // Log success
    console.log('✅ Survey feedback email sent:', {
      email,
      surveyId,
      surveyTitle: survey?.title,
      emailId: emailResult.data?.id,
      personalized: personalizedThankYou.success
    })

    return NextResponse.json({
      success: true,
      message: 'Survey feedback email sent successfully!',
      emailId: emailResult.data?.id,
      insights: emailData.insights,
      personalized: personalizedThankYou.success
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
