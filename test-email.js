// Test script to verify email functionality
// Run this in the browser console on your feedback page

async function testEmailAPI() {
  try {
    console.log('🧪 Testing email API...')
    
    const response = await fetch('/api/send-thank-you-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'your-email@example.com', // Replace with your actual email
        userName: 'Test User',
        issuesReported: [
          'Dashboard performance testing',
          'Email functionality verification',
          'UI/UX feedback testing'
        ]
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Email sent successfully!', data)
      console.log('📧 Check your email inbox for the thank you message')
    } else {
      console.error('❌ Email failed:', data)
    }
  } catch (error) {
    console.error('💥 Error testing email:', error)
  }
}

// Uncomment the line below and replace with your email to test
// testEmailAPI()

console.log('📋 Instructions:')
console.log('1. Replace "your-email@example.com" with your actual email')
console.log('2. Uncomment the testEmailAPI() line')
console.log('3. Run this script to test email functionality')
console.log('4. Check your email for the thank you message!')
