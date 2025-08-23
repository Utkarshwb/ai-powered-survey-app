// Test script for AI question generation
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'placeholder'
const isAIEnabled = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'

const FAST_MODEL = "gemini-2.5-flash"

async function testQuestionGeneration() {
  console.log("Testing AI question generation...")
  console.log("GEMINI_API_KEY value:", process.env.GEMINI_API_KEY)
  console.log("Key starts with AIza:", process.env.GEMINI_API_KEY?.startsWith('AIza'))
  console.log("Key length:", process.env.GEMINI_API_KEY?.length)
  console.log("Using GEMINI_API_KEY:", GEMINI_API_KEY ? "✅ Set" : "❌ Not set")
  console.log("AI Enabled:", isAIEnabled ? "✅ Yes" : "❌ No")
  console.log("Model:", FAST_MODEL)
  
  if (!isAIEnabled) {
    console.log("❌ AI not enabled - please check GEMINI_API_KEY")
    return
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: FAST_MODEL })

    const prompt = `
Generate customer_feedback survey questions based on this description: "Create a customer satisfaction survey for a restaurant"

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
    
    console.log("Sending request to Gemini...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log("Raw response:", text)
    
    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleanedText)
    
    console.log("✅ Question generation successful!")
    console.log(`Generated ${questions.length} questions`)
    console.log("Questions:", JSON.stringify(questions, null, 2))
    
  } catch (error) {
    console.error("❌ Error testing question generation:", error)
  }
}

testQuestionGeneration()
