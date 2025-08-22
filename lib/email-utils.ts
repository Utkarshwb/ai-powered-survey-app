// Utility to easily send thank you emails
// Usage: import { sendThankYouEmail } from '@/lib/email-utils'

interface SendThankYouEmailParams {
  email: string
  userName?: string
  issuesReported?: string[]
  customMessage?: string
}

export async function sendThankYouEmail({
  email,
  userName,
  issuesReported = [],
  customMessage
}: SendThankYouEmailParams) {
  try {
    const response = await fetch('/api/send-thank-you-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        userName,
        issuesReported,
        customMessage
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email')
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error sending thank you email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Quick function to send feedback acknowledgment
export async function sendFeedbackAcknowledgment(email: string, userName?: string) {
  return sendThankYouEmail({
    email,
    userName,
    issuesReported: [
      "Dashboard performance feedback",
      "UI/UX improvement suggestions", 
      "General user experience feedback"
    ]
  })
}
