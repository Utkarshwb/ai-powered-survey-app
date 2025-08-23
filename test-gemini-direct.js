// Direct test of Gemini API
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiAPI() {
  console.log('Testing Gemini API directly...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('API Key prefix:', apiKey?.substring(0, 10) + '...');
  
  if (!apiKey) {
    console.error('No API key found!');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('GoogleGenerativeAI initialized');
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log('Model created');
    
    const prompt = "Hello, please respond with a simple JSON object containing a greeting message.";
    console.log('Sending prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    console.log('Got result object');
    
    const response = await result.response;
    console.log('Got response object');
    
    const text = response.text();
    console.log('Response text:', text);
    
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testGeminiAPI();
