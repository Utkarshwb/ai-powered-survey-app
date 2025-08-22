// Quick setup script to create a test survey with email capture
// Run this in browser console on /dashboard to test the email feedback feature

async function createTestSurveyWithEmail() {
  console.log('🧪 Creating test survey with email capture...')
  
  try {
    // This would normally be done through the UI, but here's the structure
    const testSurvey = {
      title: "Website Feedback Survey (Email Test)",
      description: "Help us improve your experience - get personalized insights via email!",
      questions: [
        {
          question_text: "What's your email address? (Optional - we'll send you personalized insights!)",
          question_type: "email",
          is_required: false,
          order_index: 0
        },
        {
          question_text: "What's your name?",
          question_type: "text", 
          is_required: false,
          order_index: 1
        },
        {
          question_text: "How would you rate your overall experience?",
          question_type: "rating",
          is_required: true,
          order_index: 2
        },
        {
          question_text: "What issues did you encounter?",
          question_type: "multiple_choice",
          options: [
            "Internet connection problems",
            "Dark mode visibility issues", 
            "Mobile app doesn't work well",
            "Dashboard loads slowly",
            "Survey creation is confusing",
            "No issues - everything worked great!"
          ],
          is_required: false,
          order_index: 3
        },
        {
          question_text: "Any additional feedback or suggestions?",
          question_type: "text",
          is_required: false,
          order_index: 4
        }
      ]
    }
    
    console.log('📧 Test survey structure:', testSurvey)
    console.log('✅ Create this survey manually to test email feedback!')
    console.log('📋 Instructions:')
    console.log('1. Go to /surveys/new')
    console.log('2. Create a survey with the above questions')
    console.log('3. Publish it and fill it out with your email')
    console.log('4. Check your email for AI-generated insights!')
    
    return testSurvey
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Test the email feedback API directly
async function testEmailFeedbackAPI(userEmail = 'test@example.com') {
  console.log('🧪 Testing survey email feedback API...')
  
  try {
    const response = await fetch('/api/send-survey-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        userName: 'Test User',
        surveyId: 'test-survey-id',
        surveyTitle: 'Website Feedback Survey',
        answers: [
          {
            question: "What's your email address?",
            answer: userEmail,
            type: "email"
          },
          {
            question: "What's your name?", 
            answer: "Test User",
            type: "text"
          },
          {
            question: "How would you rate your overall experience?",
            answer: "4",
            type: "rating"
          },
          {
            question: "What issues did you encounter?",
            answer: ["Internet connection problems", "Dark mode visibility issues"],
            type: "multiple_choice"
          },
          {
            question: "Any additional feedback or suggestions?",
            answer: "The site could be faster and dark mode needs improvement",
            type: "text"
          }
        ]
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Email feedback sent successfully!', data)
      console.log('📧 Check your email for the AI-generated insights!')
    } else {
      console.error('❌ Failed:', data)
    }
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

// Export for console use
window.createTestSurveyWithEmail = createTestSurveyWithEmail
window.testEmailFeedbackAPI = testEmailFeedbackAPI

console.log('🎯 Test functions loaded!')
console.log('Run: createTestSurveyWithEmail() - for survey structure')
console.log('Run: testEmailFeedbackAPI("your@email.com") - to test API directly')
