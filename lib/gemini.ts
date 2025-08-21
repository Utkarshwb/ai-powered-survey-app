import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBx1kLoVOHr1qWT05ZJhOCIQh7KOC8VEkY")

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks and trim whitespace
  return text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim()
}

export async function generateSurveyQuestions(prompt: string, surveyType = "general") {
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

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    const cleanedText = cleanJsonResponse(text)
    const questions = JSON.parse(cleanedText)
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

    const cleanedText = cleanJsonResponse(text)
    const improvements = JSON.parse(cleanedText)
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

    const cleanedText = cleanJsonResponse(text)
    const analysis = JSON.parse(cleanedText)
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

    const cleanedText = cleanJsonResponse(text)
    const followUpQuestions = JSON.parse(cleanedText)
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
2. Sentiment analysis
3. Demographic patterns (if applicable)
4. Actionable recommendations
5. Areas for further investigation

Return as JSON without markdown formatting:
{
  "key_findings": ["finding 1", "finding 2"],
  "sentiment_score": 1-10,
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

    const cleanedText = cleanJsonResponse(text)
    const insights = JSON.parse(cleanedText)
    return { success: true, insights }
  } catch (error) {
    console.error("Error generating insights:", error)
    return { success: false, error: "Failed to generate insights" }
  }
}
