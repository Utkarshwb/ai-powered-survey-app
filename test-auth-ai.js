// Test authentication and AI endpoints
async function testAuthAndAI() {
  console.log('🔐 Testing authentication status...')
  
  try {
    // Check authentication
    const authResponse = await fetch('http://localhost:3000/api/auth/check')
    const authData = await authResponse.json()
    
    console.log('Auth status:', authData)
    
    if (!authData.authenticated) {
      console.log('❌ Not authenticated. Please log in to test AI features.')
      console.log('Visit http://localhost:3000 and log in first.')
      return
    }
    
    console.log('✅ Authenticated as:', authData.user.email)
    
    // Test AI question generation
    console.log('🧪 Testing AI question generation...')
    const questionsResponse = await fetch('http://localhost:3000/api/ai/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple customer feedback survey',
        surveyType: 'customer_feedback'
      })
    })
    
    if (questionsResponse.ok) {
      const questionsData = await questionsResponse.json()
      console.log('✅ AI Question Generation Working!')
      console.log('Generated', questionsData.questions?.length || 0, 'questions')
    } else {
      const errorData = await questionsResponse.json()
      console.log('❌ AI Question Generation Failed:', errorData)
    }
    
    // Test AI insights generation
    console.log('🧪 Testing AI insights generation...')
    const insightsResponse = await fetch('http://localhost:3000/api/ai/generate-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        survey: { title: 'Test Survey' },
        questions: [{ text: 'How satisfied are you?' }],
        responses: [{ answer: 'Very satisfied' }],
        sessions: []
      })
    })
    
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json()
      console.log('✅ AI Insights Generation Working!')
      console.log('Generated insights:', !!insightsData.insights)
    } else {
      const errorData = await insightsResponse.json()
      console.log('❌ AI Insights Generation Failed:', errorData)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAuthAndAI()
