// Test Authentication Setup for Anonymous Survey Access
// Run this in the browser console to test survey access without login

console.log('🧪 Testing Anonymous Survey Access...');

// Test 1: Check if survey routes are accessible without authentication
async function testSurveyAccess() {
  console.log('\n1️⃣ Testing survey route access...');
  
  try {
    // This should work without authentication
    const response = await fetch('/survey/test-survey-id');
    console.log('Survey route response status:', response.status);
    
    if (response.status === 404) {
      console.log('✅ Survey route accessible (404 is expected for non-existent survey)');
    } else if (response.status === 200) {
      console.log('✅ Survey route accessible and survey found');
    } else if (response.status === 302 || response.status === 307) {
      console.log('❌ Survey route redirecting - authentication may be required');
    } else {
      console.log('⚠️ Unexpected status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing survey access:', error);
  }
}

// Test 2: Check if survey API is accessible
async function testSurveyAPI() {
  console.log('\n2️⃣ Testing survey API access...');
  
  try {
    // Test session creation (should work without auth)
    const response = await fetch('/api/survey/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        surveyId: 'test-survey-id',
        respondentEmail: 'test@example.com',
        userAgent: navigator.userAgent
      })
    });
    
    console.log('Survey API response status:', response.status);
    
    if (response.status === 400 || response.status === 404) {
      console.log('✅ Survey API accessible (400/404 expected for non-existent survey)');
    } else if (response.status === 200) {
      console.log('✅ Survey API accessible and working');
    } else if (response.status === 401 || response.status === 403) {
      console.log('❌ Survey API requires authentication');
    } else {
      console.log('⚠️ Unexpected API status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing survey API:', error);
  }
}

// Test 3: Check if protected routes are still protected
async function testProtectedRoutes() {
  console.log('\n3️⃣ Testing protected routes...');
  
  const protectedRoutes = ['/dashboard', '/surveys/new'];
  
  for (const route of protectedRoutes) {
    try {
      const response = await fetch(route);
      console.log(`${route} response status:`, response.status);
      
      if (response.status === 302 || response.status === 307) {
        console.log(`✅ ${route} properly protected (redirecting)`);
      } else if (response.status === 401 || response.status === 403) {
        console.log(`✅ ${route} properly protected (unauthorized)`);
      } else {
        console.log(`⚠️ ${route} may not be properly protected`);
      }
    } catch (error) {
      console.error(`❌ Error testing ${route}:`, error);
    }
  }
}

// Run all tests
async function runAllTests() {
  await testSurveyAccess();
  await testSurveyAPI();
  await testProtectedRoutes();
  
  console.log('\n🎯 Test Summary:');
  console.log('- Survey routes should be accessible without login');
  console.log('- Survey APIs should work for anonymous users');
  console.log('- Protected routes should still require authentication');
  console.log('\n📝 To test with a real survey:');
  console.log('1. Create and publish a survey while logged in');
  console.log('2. Copy the survey URL');
  console.log('3. Open in incognito window');
  console.log('4. Verify you can complete the survey without login');
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.testSurveyAuth = {
  testSurveyAccess,
  testSurveyAPI,
  testProtectedRoutes,
  runAllTests
};

console.log('\n🔧 Functions available: window.testSurveyAuth');
