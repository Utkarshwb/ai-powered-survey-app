// Test scenarios for AI email generation
// Use these examples to test the feedback system

export const testScenarios = [
  {
    name: "Internet Connection Issues",
    email: "user1@test.com",
    userName: "John Doe",
    issues: [
      "The site loads very slowly",
      "Internet connection problems",
      "Sometimes pages don't load at all",
      "Network timeout errors"
    ]
  },
  {
    name: "Dark Mode Problems", 
    email: "user2@test.com",
    userName: "Sarah Smith",
    issues: [
      "Dark mode has white flashes",
      "Text is hard to read in dark theme",
      "Some buttons disappear in dark mode"
    ]
  },
  {
    name: "Mobile Experience",
    email: "user3@test.com", 
    userName: "Mike Johnson",
    issues: [
      "App doesn't work well on mobile",
      "Buttons are too small on phone",
      "Layout is broken on tablet"
    ]
  },
  {
    name: "Survey Creation Issues",
    email: "user4@test.com",
    userName: "Lisa Chen", 
    issues: [
      "Can't save my survey",
      "Question types are confusing",
      "Preview doesn't work",
      "Lost my work when browser crashed"
    ]
  },
  {
    name: "Performance & Speed",
    email: "user5@test.com",
    userName: "David Wilson",
    issues: [
      "Dashboard takes forever to load", 
      "Charts are slow to render",
      "Clicking buttons has delay",
      "App feels laggy overall"
    ]
  },
  {
    name: "Login & Authentication",
    email: "user6@test.com",
    userName: "Emma Davis",
    issues: [
      "Can't log in sometimes",
      "Password reset doesn't work",
      "Keep getting logged out",
      "Two-factor auth is broken"
    ]
  }
]

// Function to test AI email generation with different scenarios
export async function testEmailGeneration() {
  console.log("🧪 Testing AI Email Generation with different scenarios...")
  
  for (const scenario of testScenarios) {
    console.log(`\n📧 Testing: ${scenario.name}`)
    console.log(`User: ${scenario.userName} (${scenario.email})`)
    console.log(`Issues: ${scenario.issues.join(', ')}`)
    
    try {
      const response = await fetch('/api/send-thank-you-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: scenario.email,
          userName: scenario.userName,
          issuesReported: scenario.issues,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Email sent successfully! Fixes: ${data.fixes?.join(', ')}`)
      } else {
        console.log(`❌ Failed: ${data.error}`)
      }
    } catch (error) {
      console.log(`💥 Error: ${error}`)
    }
    
    // Wait 2 seconds between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log("\n🎉 Email generation testing complete!")
}

// Quick test function for manual testing
export async function quickTest(userEmail: string) {
  const scenario = testScenarios[0] // Internet issues scenario
  
  return fetch('/api/send-thank-you-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      userName: "Test User",
      issuesReported: scenario.issues,
    }),
  })
}
