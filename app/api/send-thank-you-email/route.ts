import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generatePersonalizedEmail } from '@/lib/ai-email-generator'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      userName, 
      issuesReported = [], 
      customMessage 
    } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Add any custom issues reported
    const allIssuesReported = issuesReported.length > 0 ? issuesReported : [
      "General feedback about the application"
    ]

    // Generate personalized email using AI
    const emailData = await generatePersonalizedEmail(
      userName || 'Valued User',
      email,
      allIssuesReported
    )

    // Send the email
    const emailHtml = await resend.emails.send({
      from: 'FormWise AI <onboarding@resend.dev>', // Using Resend's default domain
      to: [email],
      subject: emailData.subject,
      html: emailData.content
    })

    // Log the success (optional - for debugging)
    console.log('✅ AI-generated thank you email sent successfully:', {
      email,
      userName,
      issues: allIssuesReported,
      fixes: emailData.fixes,
      emailId: emailHtml.data?.id
    })

    return NextResponse.json({
      success: true,
      message: 'AI-generated thank you email sent successfully!',
      emailId: emailHtml.data?.id,
      fixes: emailData.fixes
    })

  } catch (error) {
    console.error('❌ Error sending thank you email:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Thank you email API endpoint is working!',
    usage: 'Send POST request with { email, userName?, issuesReported?, customMessage? }'
  })
}
