import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface GenerateEmailResponse {
  subject: string
  content: string
  fixes: string[]
}

interface SurveyFeedbackResponse {
  subject: string
  content: string
  insights: string[]
}

interface SurveyFeedbackParams {
  userName: string
  email: string
  surveyTitle: string
  surveyDescription: string
  questions: any[]
  answers: any[]
}

export async function generatePersonalizedEmail(
  userName: string,
  userEmail: string,
  issuesReported: string[]
): Promise<GenerateEmailResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
You are an AI assistant for FormWise, an AI-powered survey tool. A user has submitted feedback reporting issues. Generate a professional, personalized thank you email that:

1. Thanks the user warmly for their feedback
2. Acknowledges each specific issue they reported
3. Provides specific fixes/solutions for each issue
4. Sets realistic expectations for implementation
5. Maintains a professional but friendly tone

User Details:
- Name: ${userName || 'Valued User'}
- Email: ${userEmail}
- Issues Reported: ${issuesReported.join(', ')}

Based on the issues reported, generate:
1. An engaging email subject line
2. Professional email content in HTML format
3. A list of specific fixes we'll implement

Common issues and their fixes:
- Internet/Connection problems → "Optimizing server infrastructure and implementing offline mode"
- Slow loading → "Database optimization and caching improvements"
- Dark mode issues → "Enhanced dark mode contrast and theme consistency"
- Mobile problems → "Responsive design improvements and mobile optimization"
- UI/UX issues → "Interface redesign and user experience enhancements"
- Login problems → "Authentication system improvements and better error handling"
- Survey creation issues → "Enhanced survey builder with better validation"
- Analytics problems → "Improved analytics dashboard with faster data processing"

Return ONLY a JSON object with this exact structure:
{
  "subject": "engaging subject line here",
  "content": "complete HTML email content here",
  "fixes": ["specific fix 1", "specific fix 2", "specific fix 3"]
}

Make the email feel personal, professional, and solution-focused. Include specific timeline (24-48 hours for fixes).
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const cleanText = text.replace(/```json|```/g, '').trim()
    const emailData = JSON.parse(cleanText)

    return {
      subject: emailData.subject || "Thank you for your valuable feedback!",
      content: emailData.content || "Thank you for your feedback. We're working on improvements!",
      fixes: emailData.fixes || ["General improvements and bug fixes"]
    }

  } catch (error) {
    console.error('Error generating personalized email:', error)
    
    // Fallback response
    return {
      subject: "🙏 Thank you for your feedback!",
      content: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${userName || 'there'}! 👋</h2>
          <p>Thank you so much for taking the time to provide feedback on FormWise.</p>
          <p>We've received your report about: <strong>${issuesReported.join(', ')}</strong></p>
          <p>Our team is already working on these improvements and you can expect fixes within 24-48 hours.</p>
          <p>We'll keep you updated on our progress!</p>
          <p>Best regards,<br>The FormWise Team</p>
        </div>
      `,
      fixes: [
        "Address reported issues with high priority",
        "Implement immediate bug fixes",
        "Enhance overall user experience"
      ]
    }
  }
}

export async function generateSurveyFeedbackEmail({
  userName,
  email,
  surveyTitle,
  surveyDescription,
  questions,
  answers
}: SurveyFeedbackParams): Promise<SurveyFeedbackResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Format questions and answers for AI analysis
    const formattedResponses = questions.map((question, index) => {
      const answer = answers[index] || 'No answer provided'
      return `Q: ${question.text}\nA: ${answer}`
    }).join('\n\n')

    const prompt = `
You are an AI assistant for FormWise. A user has just completed a survey and provided their email. Generate a personalized thank you email with insights and analysis based on their responses.

Survey Details:
- Title: ${surveyTitle}
- Description: ${surveyDescription}
- Participant: ${userName} (${email})

User's Responses:
${formattedResponses}

Generate a professional, insightful email that:
1. Thanks them for participating
2. Provides personalized insights based on their answers
3. Offers relevant recommendations or next steps
4. Maintains a professional but friendly tone
5. Shows how their responses contribute to valuable data

Analyze their responses and provide:
- Key insights about their preferences/opinions
- How their responses compare to trends
- Personalized recommendations
- Ways they can stay engaged

Return ONLY a JSON object with this exact structure:
{
  "subject": "engaging subject line based on their responses",
  "content": "complete HTML email content with personalized insights",
  "insights": ["insight 1", "insight 2", "insight 3"]
}

Make the email feel personal and valuable - they should feel their time was well spent and their input matters.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const cleanText = text.replace(/```json|```/g, '').trim()
    const emailData = JSON.parse(cleanText)

    return {
      subject: emailData.subject || `Thank you for completing "${surveyTitle}"!`,
      content: emailData.content || `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you, ${userName}! 🎉</h2>
          <p>We appreciate you taking the time to complete "${surveyTitle}".</p>
          <p>Your responses are valuable and will help us improve our services.</p>
          <p>Best regards,<br>The FormWise Team</p>
        </div>
      `,
      insights: emailData.insights || [
        "Your participation helps us understand user needs better",
        "Thank you for providing valuable feedback",
        "Your responses contribute to meaningful insights"
      ]
    }

  } catch (error) {
    console.error('Error generating survey feedback email:', error)
    
    // Fallback response
    return {
      subject: `Thank you for completing "${surveyTitle}"! 🙏`,
      content: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">
              🎉 Thank You for Your Participation!
            </h1>
            <p style="color: #f0f9ff; font-size: 16px; margin: 0; opacity: 0.9;">
              Your responses help us build better experiences
            </p>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0;">Hi ${userName}! 👋</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for taking the time to complete "${surveyTitle}". Your thoughtful responses are incredibly valuable to us.
            </p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #166534; font-size: 16px; margin: 0 0 10px 0;">🎯 Your Impact:</h3>
              <ul style="color: #166534; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Your responses help us understand user needs better</li>
                <li>Your feedback contributes to meaningful product improvements</li>
                <li>You're part of a community that shapes the future of surveys</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Thank you again for being such a valuable part of our community!
            </p>
            
            <p style="color: #4b5563; font-size: 16px; margin: 0;">
              Best regards,<br />
              <strong style="color: #1f2937;">The FormWise Team</strong> 🚀
            </p>
          </div>
        </div>
      `,
      insights: [
        "Your participation helps us understand user needs better",
        "Thank you for providing valuable feedback", 
        "Your responses contribute to meaningful insights"
      ]
    }
  }
}
