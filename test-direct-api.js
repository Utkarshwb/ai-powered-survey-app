// Test AI API with Next.js running
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Read from .env.local file 
const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  const envLocalPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        process.env[key.trim()] = value.trim();
      }
    }
  }
}

loadEnvLocal();

async function testAPIDirectly() {
  console.log('🧪 Testing AI Question Generation API...')
  console.log('GEMINI_API_KEY from .env.local:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Not found')
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ No API key found in .env.local')
    return
  }

  try {
    // Test Gemini directly
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    console.log('📝 Testing direct Gemini API call...')
    
    const prompt = `Generate 3 simple survey questions as JSON array:
[
  {
    "question_text": "Question 1",
    "question_type": "text",
    "required": true,
    "order_index": 1
  }
]
Return only JSON, no other text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Raw Gemini Response:', text)
    
    // Try to parse
    const cleanedText = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleanedText)
    
    console.log('✅ Parsed Questions:', questions.length)
    console.log('✅ Questions:', JSON.stringify(questions, null, 2))
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error.message)
  }
}

testAPIDirectly()
