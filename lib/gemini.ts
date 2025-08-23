import { GoogleGenerativeAI } from "@google/generative-ai"

// Check if API key is available, but provide fallback
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'placeholder'
const isAIEnabled = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'

// Model Selection Strategy:
// - Gemini 2.5 Flash: Fast question generation
// - Gemini 2.5 Pro: Complex analysis and insights
const FAST_MODEL = "gemini-2.5-flash"     // For question generation  
const SMART_MODEL = "gemini-2.5-pro"      // For insights and analysis

let genAI: GoogleGenerativeAI
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
} catch (error) {
  console.warn('Failed to initialize Google Gemini AI:', error)
}

// Export AI availability status
export { isAIEnabled }

// Cache for AI responses to avoid redundant calls
const responseCache = new Map<string, any>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(prompt: string, type: string): string {
  return `${type}:${Buffer.from(prompt).toString('base64').slice(0, 50)}`
}

function getFromCache(key: string): any | null {
  const cached = responseCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  responseCache.delete(key)
  return null
}

function setCache(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() })
}

// Timeout wrapper for AI calls
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 30000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('AI request timeout')), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

// Enhanced error handling
function handleAIError(error: any, fallback: any = null) {
  console.error('AI Error:', error)
  if (error.message?.includes('API_KEY')) {
    return {
      success: false,
      error: 'Invalid API key. Please check your Google Gemini API configuration.',
      ...fallback
    }
  }
  if (error.message?.includes('SAFETY')) {
    return {
      success: false,
      error: 'Content filtered for safety. Please try a different prompt.',
      ...fallback
    }
  }
  return {
    success: false,
    error: `AI service error: ${error.message || 'Unknown error'}`,
    ...fallback
  }
}

export async function generateSurveyQuestions(prompt: string, surveyType = "general") {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      questions: []
    }
  }

  const cacheKey = getCacheKey(prompt + surveyType, 'questions')
  const cached = getFromCache(cacheKey)
  if (cached) {
    return { success: true, questions: cached }
  }

  try {
    const model = genAI.getGenerativeModel({ model: FAST_MODEL })

    const enhancedPrompt = `
Generate ${surveyType} survey questions based on this description: "${prompt}"

Return a JSON array of survey questions with this structure:
[
  {
    "question_text": "Your question here",
    "question_type": "text|multiple_choice|rating|boolean|number|email",
    "required": true,
    "options": ["Option 1", "Option 2", "Option 3"], // only for multiple_choice
    "order_index": 1
  }
]

Requirements:
- Make questions clear and unbiased
- Use appropriate question types for the data you want to collect
- Include 1-2 required questions and some optional ones
- For rating questions, don't include options (they're handled automatically)
- For text/email/number questions, don't include options
- Order questions logically (demographics last)
- Return only the JSON array, no other text
`

    const result = await withTimeout(model.generateContent(enhancedPrompt))
    const response = await result.response
    const text = response.text()

    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleanedText)

    // Validate structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format')
    }

    // Set cache
    setCache(cacheKey, questions)

    return {
      success: true,
      questions: questions
    }
  } catch (error) {
    return handleAIError(error, { questions: [] })
  }
}

export async function improveSurveyQuestion(questionText: string, context = "") {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      improvements: []
    }
  }

  const cacheKey = getCacheKey(questionText + context, 'improve')
  const cached = getFromCache(cacheKey)
  if (cached) {
    return { success: true, improvements: cached }
  }

  try {
    const model = genAI.getGenerativeModel({ model: FAST_MODEL })

    const prompt = `
Improve this survey question and provide 2-3 alternative versions:

Original question: "${questionText}"
Context: ${context}

Please return a JSON array with this exact structure:
[
  {
    "question": "Improved version 1",
    "reason": "Brief explanation why this is better"
  },
  {
    "question": "Improved version 2", 
    "reason": "Brief explanation why this is better"
  }
]

Make each improvement:
- Clear and concise
- Neutral and unbiased
- Professional but approachable
- Easy to understand
- Address different potential issues (clarity, bias, engagement, etc.)

Return ONLY the JSON array, no other text.
`

    const result = await withTimeout(model.generateContent(prompt))
    const response = await result.response
    const text = response.text().trim()
    
    // Clean the response by removing markdown code blocks and extra whitespace
    const cleanedText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*\n+/gm, '')
      .trim()
    
    try {
      const improvements = JSON.parse(cleanedText)
      setCache(cacheKey, improvements)
      
      return {
        success: true,
        improvements: Array.isArray(improvements) ? improvements : []
      }
    } catch (parseError) {
      // Improved fallback: try to extract meaningful improvements from the text
      const fallbackImprovements = []
      
      // Try to extract question improvements from the malformed response
      const questionMatches = text.match(/question[:\s]*([^,\n]+)/gi)
      const reasonMatches = text.match(/reason[:\s]*([^,\n]+)/gi)
      
      if (questionMatches && questionMatches.length > 0) {
        questionMatches.forEach((match, index) => {
          const questionText = match.replace(/question[:\s]*/i, '').trim()
          const reasonText = reasonMatches?.[index]?.replace(/reason[:\s]*/i, '')?.trim() || "AI-improved version"
          
          if (questionText && questionText !== questionText.toUpperCase()) {
            fallbackImprovements.push({
              question: questionText.replace(/[^\w\s\?\.\,\!\-\(\)]/g, '').trim(),
              reason: reasonText.replace(/[^\w\s\?\.\,\!\-\(\)]/g, '').trim()
            })
          }
        })
      }
      
      // If no improvements extracted, create a simple one
      if (fallbackImprovements.length === 0) {
        fallbackImprovements.push({
          question: questionText,
          reason: "Original question (AI improvement failed)"
        })
      }
      
      return {
        success: true,
        improvements: fallbackImprovements.slice(0, 3) // Limit to 3 improvements
      }
    }
  } catch (error) {
    return handleAIError(error, { improvements: [] })
  }
}

export async function analyzeSurveyStructure(survey: any, questions: any[]) {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      analysis: {}
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: SMART_MODEL })

    const prompt = `
Analyze this survey structure and provide recommendations:

Survey Title: ${survey.title}
Description: ${survey.description || 'None'}

Questions:
${questions.map((q, i) => `${i + 1}. ${q.question_text} (${q.question_type}, ${q.is_required ? 'required' : 'optional'})`).join('\n')}

Please provide analysis in this JSON format:
{
  "overall_rating": 8,
  "strengths": ["Clear questions", "Good flow"],
  "improvements": ["Add demographic questions", "Shorten question 3"],
  "estimated_completion_time": "5-7 minutes",
  "question_count_recommendation": "good",
  "flow_analysis": "Questions flow logically from general to specific"
}
`

    const result = await withTimeout(model.generateContent(prompt))
    const response = await result.response
    const text = response.text()
    
    const cleanedText = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(cleanedText)

    return {
      success: true,
      analysis: analysis
    }
  } catch (error) {
    return handleAIError(error, { analysis: {} })
  }
}

export async function generateFollowUpQuestions(responses: any[], surveyContext: string) {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      questions: []
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: SMART_MODEL })

    const responsesSummary = responses.map(r => `Q: ${r.question} A: ${r.answer}`).join('\n')

    const prompt = `
Based on these survey responses, generate 2-3 relevant follow-up questions:

Context: ${surveyContext}
Responses:
${responsesSummary}

Generate questions that dig deeper into interesting responses or explore related topics.
Return as JSON array with same structure as before.
`

    const result = await withTimeout(model.generateContent(prompt))
    const response = await result.response
    const text = response.text()

    const cleanedText = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleanedText)

    return {
      success: true,
      questions: questions
    }
  } catch (error) {
    return handleAIError(error, { questions: [] })
  }
}

export async function generateSurveyInsights(responses: any[], questions: any[]) {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      insights: {}
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: SMART_MODEL })

    let prompt = ""

    if (responses.length === 0) {
      // Generate insights for survey structure when no responses are available
      const questionSummary = questions.map((q, index) => 
        `${index + 1}. ${q.question_text} (Type: ${q.question_type})`
      ).join('\n')

      prompt = `
Analyze this survey structure and provide insights about the survey design:

Survey Questions:
${questionSummary}

Since there are no responses yet, provide insights about the survey design and potential improvements in this exact JSON format:
{
  "summary": "Analysis of the survey structure and design",
  "key_findings": ["Finding about survey design 1", "Finding about survey design 2", "Finding about survey design 3"],
  "trends": ["Potential trend that could emerge", "Another potential insight"],
  "recommendations": ["Recommendation for improving the survey", "Suggestion for better data collection", "Tip for increasing response rates"],
  "sentiment": "neutral",
  "sentiment_score": 5,
  "notable_patterns": ["Survey design pattern", "Question structure observation"],
  "response_quality": "No responses available yet - these are design insights",
  "engagement_level": "Unknown - survey hasn't received responses yet"
}

Return ONLY the JSON, no other text.
`
    } else {
      // Original logic for when responses exist
      const responseSummary = responses.map(r => {
        const question = questions.find(q => q.id === r.question_id)
        return `Q: ${question?.question_text} A: ${r.answer_text || r.answer_number || r.answer_boolean}`
      }).join('\n')

      prompt = `
Analyze these survey responses and provide insights:

${responseSummary}

Provide insights in this exact JSON format:
{
  "summary": "Brief overview of the survey responses",
  "key_findings": ["Finding 1", "Finding 2", "Finding 3"],
  "trends": ["Trend 1", "Trend 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "sentiment": "positive/neutral/negative",
  "sentiment_score": 7,
  "notable_patterns": ["Pattern 1", "Pattern 2"],
  "response_quality": "High quality responses with detailed feedback",
  "completion_rate_analysis": "Strong completion rate with minimal dropoffs"
}

Requirements:
- sentiment_score should be a number from 1-10
- Include at least 2-4 items in each array
- Make insights specific to the actual responses
- Focus on actionable recommendations

Return ONLY the JSON, no other text.
`
    }

    const result = await withTimeout(model.generateContent(prompt))
    const response = await result.response
    const text = response.text()

    const cleanedText = text.replace(/```json|```/g, '').trim()
    const insights = JSON.parse(cleanedText)

    return {
      success: true,
      insights: insights
    }
  } catch (error) {
    return handleAIError(error, { insights: {} })
  }
}

export async function generatePersonalizedThankYou(
  answers: Array<{ question: string; answer: string; type: string }>,
  surveyTitle: string
) {
  if (!isAIEnabled) {
    return {
      success: false,
      error: "AI features are not available. Please configure GEMINI_API_KEY in your environment variables.",
      message: "Thank you for completing our survey! Your responses are valuable to us."
    }
  }

  const cacheKey = getCacheKey(JSON.stringify(answers) + surveyTitle, 'thankYou')
  const cached = getFromCache(cacheKey)
  if (cached) {
    return { success: true, message: cached }
  }

  try {
    const model = genAI.getGenerativeModel({ model: SMART_MODEL })

    const responseSummary = answers.map(a => `${a.question}: ${a.answer}`).join('\n')

    const prompt = `
Create a personalized thank you message for someone who completed the survey "${surveyTitle}".

Their responses:
${responseSummary}

Create a warm, personalized thank you message that:
- Acknowledges their specific responses where appropriate
- Shows their input is valued
- Is genuine and not overly promotional
- Is 2-3 sentences
- Mentions something specific from their answers when relevant

Return only the thank you message, no quotes or extra text.
`

    const result = await withTimeout(model.generateContent(prompt))
    const response = await result.response
    const message = response.text().trim()

    // Set cache
    setCache(cacheKey, message)

    return {
      success: true,
      message: message
    }
  } catch (error) {
    return handleAIError(error, { 
      message: "Thank you for completing our survey! Your responses are valuable to us."
    })
  }
}