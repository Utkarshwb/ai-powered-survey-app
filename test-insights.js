// Test script for AI insights functionality
const https = require('https');

const testData = {
  survey: {
    title: "Customer Satisfaction Survey",
    description: "Test survey for insight generation"
  },
  questions: [
    {
      id: 1,
      question_text: "How satisfied are you with our service?",
      question_type: "scale"
    },
    {
      id: 2,
      question_text: "What can we improve?",
      question_type: "text"
    }
  ],
  responses: [
    {
      question_id: 1,
      answer_number: 8
    },
    {
      question_id: 2,
      answer_text: "Better customer support"
    }
  ],
  sessions: [],
  hasResponses: true
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/generate-insights',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    // You'll need to add authentication headers here
    'Cookie': 'your-auth-cookie-here'
  }
};

console.log('Testing AI insights generation...');
console.log('Note: You need to be authenticated and have a valid session cookie');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
