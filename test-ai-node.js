const https = require('https');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function testAIImprove() {
  console.log('🔧 Testing AI Improve functionality...\n');
  
  // First test the AI status
  try {
    console.log('1. Checking AI status...');
    const statusResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai/status',
      method: 'GET'
    });
    
    console.log('Status Response:', statusResult);
    
    if (statusResult.data.aiEnabled) {
      console.log('✅ AI is enabled\n');
      
      // Test the improve question endpoint
      console.log('2. Testing improve question...');
      const improveResult = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/ai/improve-question',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, JSON.stringify({
        questionText: 'Do you like our product?',
        context: 'Customer satisfaction survey'
      }));
      
      console.log('Improve Response:', improveResult);
      
      if (improveResult.data.improvements) {
        console.log('✅ AI improve is working!');
        console.log('Number of improvements:', improveResult.data.improvements.length);
      } else {
        console.log('❌ No improvements returned');
      }
    } else {
      console.log('❌ AI is not enabled');
      console.log('Reason:', statusResult.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testAIImprove();
