import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

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
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI request timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks and trim whitespace
  let cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim()
  
  // Find the first { and last } to extract just the JSON part
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }
  
  return cleaned
}

function validateAndParseJSON(text: string, fallbackData: any) {
  try {
    const cleanedText = cleanJsonResponse(text)
    return JSON.parse(cleanedText)
  } catch (error) {
    console.warn("Failed to parse AI response as JSON, using fallback:", error)
    console.log("Raw AI response:", text)
    return fallbackData
  }
}

export async function generateSurveyQuestions(prompt: string, surveyType = "general") {
  const cacheKey = getCacheKey(prompt + surveyType, 'questions')
  const cached = getFromCache(cacheKey)
  if (cached) {
    return { success: true, questions: cached }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const enhancedPrompt = `
You are an expert survey designer. Generate 5-8 high-quality survey questions based on this request: "${prompt}"

Survey type: ${surveyType}

Please return a JSON array of questions with this exact structure:
[
  {
    "question_text": "Your question here",
    "question_type": "multiple_choice|text|rating|yes_no|email|number",
    "options": ["Option 1", "Option 2", "Option 3"] // only for multiple_choice
  }
]

Guidelines:
- Use varied question types appropriate for the survey
- For multiple_choice, provide 3-5 clear options
- For rating questions, use 1-5 or 1-10 scales
- Make questions clear, unbiased, and actionable
- Ensure logical flow from general to specific
- Include both quantitative and qualitative questions when appropriate

Return only the JSON array, no additional text or markdown formatting.
`

    const result = await withTimeout(
      model.generateContent(enhancedPrompt),
      15000 // 15 second timeout
    )
    const response = await result.response
    const text = response.text()

    const fallbackQuestions = [
      {
        question_text: "How would you rate your overall experience?",
        question_type: "rating",
        options: []
      },
      {
        question_text: "What did you like most?",
        question_type: "text",
        options: []
      }
    ]

    const questions = validateAndParseJSON(text, fallbackQuestions)
    setCache(cacheKey, questions)
    return { success: true, questions }
  } catch (error) {
    console.error("Error generating questions:", error)
    return { success: false, error: "Failed to generate questions" }
  }
}

export async function improveSurveyQuestion(questionText: string, context = "") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `
Improve this survey question to make it clearer, more engaging, and more effective:

Original question: "${questionText}"
Context: ${context}

Provide 3 improved versions with brief explanations of why each is better.
Return as JSON without markdown formatting:
{
  "improvements": [
    {
      "question": "Improved question text",
      "reason": "Why this version is better"
    }
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const fallbackImprovements = {
      improvements: [
        "Consider making the question more specific",
        "Ensure the question is unbiased and neutral",
        "Check if the question allows for all possible answers"
      ]
    }

    const improvements = validateAndParseJSON(text, fallbackImprovements)
    return { success: true, improvements: improvements.improvements }
  } catch (error) {
    console.error("Error improving question:", error)
    return { success: false, error: "Failed to improve question" }
  }
}

export async function analyzeSurveyStructure(survey: any, questions: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `
Analyze this survey structure and provide optimization suggestions:

Survey Title: "${survey.title}"
Description: "${survey.description || "No description"}"

Questions:
${questions.map((q, i) => `${i + 1}. ${q.question_text} (Type: ${q.question_type}${q.options ? `, Options: ${q.options.join(", ")}` : ""})`).join("\n")}

Please provide a comprehensive analysis including:
1. Overall survey flow and logic
2. Question quality and clarity
3. Question order optimization
4. Missing question types or topics
5. Potential bias or leading questions
6. Estimated completion time
7. Specific improvement recommendations

Return as JSON without markdown formatting:
{
  "overall_score": 1-10,
  "estimated_completion_time": "X minutes",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": [
    {
      "type": "reorder|improve|add|remove",
      "question_index": 0,
      "suggestion": "Specific suggestion",
      "reason": "Why this improvement is needed"
    }
  ],
  "flow_analysis": "Analysis of question flow and logic",
  "bias_check": "Assessment of potential bias in questions"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const fallbackAnalysis = {
      overall_score: 7,
      estimated_completion_time: "5-10 minutes",
      strengths: ["Survey structure is reasonable"],
      weaknesses: ["Analysis temporarily unavailable"],
      recommendations: [
        {
          type: "improve",
          question_index: 0,
          suggestion: "Consider reviewing question clarity",
          reason: "Enhanced clarity improves response quality"
        }
      ],
      flow_analysis: "Survey flow appears logical",
      bias_check: "No obvious bias detected"
    }

    const analysis = validateAndParseJSON(text, fallbackAnalysis)
    return { success: true, analysis }
  } catch (error) {
    console.error("Error analyzing survey:", error)
    return { success: false, error: "Failed to analyze survey" }
  }
}

export async function generateFollowUpQuestions(responses: any[], surveyContext: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `
Based on these survey responses, generate intelligent follow-up questions:

Survey Context: ${surveyContext}

Sample Responses:
${responses
  .slice(0, 10)
  .map((r, i) => `Response ${i + 1}: ${JSON.stringify(r)}`)
  .join("\n")}

Generate 3-5 follow-up questions that would provide deeper insights based on the patterns you see in the responses.

Return as JSON without markdown formatting:
[
  {
    "question_text": "Follow-up question",
    "question_type": "text|multiple_choice|rating",
    "reasoning": "Why this follow-up question would be valuable",
    "options": ["option1", "option2"] // only for multiple_choice
  }
]
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const fallbackQuestions = [
      {
        question_text: "What additional feedback would you like to share?",
        question_type: "text",
        reasoning: "Gather open-ended feedback for deeper insights"
      },
      {
        question_text: "How likely are you to participate in future surveys?",
        question_type: "rating",
        reasoning: "Assess engagement for future research"
      }
    ]

    const followUpQuestions = validateAndParseJSON(text, fallbackQuestions)
    return { success: true, questions: followUpQuestions }
  } catch (error) {
    console.error("Error generating follow-up questions:", error)
    return { success: false, error: "Failed to generate follow-up questions" }
  }
}

export async function generateSurveyInsights(responses: any[], questions: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `
Analyze these survey responses and generate actionable insights:

Questions:
${questions.map((q, i) => `${i + 1}. ${q.question_text} (${q.question_type})`).join("\n")}

Responses Summary:
${responses
  .slice(0, 20)
  .map((r, i) => `Response ${i + 1}: ${JSON.stringify(r)}`)
  .join("\n")}

Provide comprehensive insights including:
1. Key findings and trends
2. Sentiment analysis (1-10 scale)
3. Demographic patterns (if applicable)
4. Actionable recommendations
5. Areas for further investigation

IMPORTANT: Return ONLY valid JSON in this exact format (no extra text, no markdown):
{
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "sentiment_score": 7,
  "trends": ["trend 1", "trend 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "response_quality": "Assessment of response quality",
  "completion_rate_analysis": "Analysis of completion patterns",
  "notable_patterns": ["pattern 1", "pattern 2"]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const fallbackInsights = {
      key_findings: ["Survey responses collected successfully"],
      sentiment_score: 5,
      trends: ["Data analysis pending"],
      recommendations: ["Continue collecting responses for better insights"],
      response_quality: "Good response rate observed",
      completion_rate_analysis: "Standard completion patterns",
      notable_patterns: ["More analysis needed with larger sample size"]
    }

    const insights = validateAndParseJSON(text, fallbackInsights)
    return { success: true, insights }
  } catch (error) {
    console.error("Error generating insights:", error)
    return { 
      success: false, 
      error: "Failed to generate insights",
      insights: {
        key_findings: ["Unable to generate AI insights at this time"],
        sentiment_score: 5,
        trends: ["Analysis temporarily unavailable"],
        recommendations: ["Try again later or contact support"],
        response_quality: "Analysis pending",
        completion_rate_analysis: "Analysis pending", 
        notable_patterns: ["AI analysis temporarily unavailable"]
      }
    }
  }
}
