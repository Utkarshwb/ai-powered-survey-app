// Test script to check AI improve functionality
console.log('Testing AI improve question...')

async function testImproveQuestion() {
  try {
    const response = await fetch('http://localhost:3000/api/ai/improve-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText: 'Do you like our product?',
        context: 'Customer satisfaction survey'
      })
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
    
    if (data.improvements) {
      console.log('✅ AI improve is working!')
      console.log('Improvements:', data.improvements)
    } else {
      console.log('❌ No improvements returned')
    }
  } catch (error) {
    console.error('❌ Error testing AI improve:', error)
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testImproveQuestion()
}

export { testImproveQuestion }
