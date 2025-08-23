// Test AI endpoints functionality
async function testGenerateQuestions() {
  console.log('🧪 Testing AI question generation...')
  
  try {
    const response = await fetch('http://localhost:3000/api/ai/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple feedback survey',
        surveyType: 'general'
      })
    })

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText)
      const text = await response.text()
      console.error('Response:', text)
      return
    }

    const result = await response.json()
    console.log('✅ AI Question Generation Working!')
    console.log('Generated', result.questions?.length || 0, 'questions')
    
    if (result.questions && result.questions.length > 0) {
      console.log('Sample question:', result.questions[0].text)
    }
    
  } catch (error) {
    console.error('❌ Error testing question generation:', error.message)
  }
}

async function testImproveQuestion() {
  console.log('🧪 Testing AI question improvement...')
  
  try {
    const response = await fetch('http://localhost:3000/api/test-improve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText: 'Do you like our product?'
      })
    })

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText)
      return
    }

    const result = await response.json()
    console.log('✅ AI Question Improvement Working!')
    console.log('Generated', result.improvements?.length || 0, 'improvements')
    
  } catch (error) {
    console.error('❌ Error testing question improvement:', error.message)
  }
}

// Run tests
testGenerateQuestions()
  .then(() => testImproveQuestion())
  .then(() => console.log('🎉 Tests completed!'))
