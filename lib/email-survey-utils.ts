// Utility functions for email-enabled surveys

export const emailQuestionTemplates = {
  // Standard email question that should be first in survey
  emailCapture: {
    question_text: "What's your email address?",
    question_type: "email" as const,
    is_required: false,
    placeholder: "your@email.com",
    description: "Optional - we'll send you personalized insights based on your responses!"
  },

  // Name question to pair with email
  nameCapture: {
    question_text: "What's your name?",
    question_type: "text" as const,
    is_required: false,
    placeholder: "John Doe",
    description: "Optional - helps us personalize your feedback email"
  },

  // Combined name + email question
  contactCapture: {
    question_text: "Your contact information (optional)",
    question_type: "text" as const,
    is_required: false,
    placeholder: "Name: John Doe, Email: john@example.com",
    description: "Share your name and email to receive personalized insights!"
  }
}

// Helper to detect if a survey has email capture
export function hasEmailCapture(questions: any[]): boolean {
  return questions.some(question => 
    question.question_type === 'email' || 
    (question.question_type === 'text' && 
     question.question_text.toLowerCase().includes('email'))
  )
}

// Helper to find the optimal position for email question
export function getEmailQuestionPosition(existingQuestions: any[]): number {
  // Email should be first or second question for best response rates
  if (existingQuestions.length === 0) return 0
  if (existingQuestions.length === 1) return 1
  return Math.min(2, existingQuestions.length)
}

// Template surveys with email capture built-in
export const emailEnabledSurveyTemplates = {
  customerFeedback: {
    title: "Customer Feedback Survey",
    description: "Help us improve your experience",
    questions: [
      {
        ...emailQuestionTemplates.emailCapture,
        order_index: 0
      },
      {
        question_text: "How satisfied are you with our service?",
        question_type: "rating" as const,
        is_required: true,
        order_index: 1
      },
      {
        question_text: "What could we improve?",
        question_type: "text" as const,
        is_required: false,
        order_index: 2
      }
    ]
  },

  productResearch: {
    title: "Product Research Survey",
    description: "Share your thoughts on our product direction",
    questions: [
      {
        ...emailQuestionTemplates.nameCapture,
        order_index: 0
      },
      {
        ...emailQuestionTemplates.emailCapture,
        order_index: 1
      },
      {
        question_text: "Which features are most important to you?",
        question_type: "multiple_choice" as const,
        options: ["Performance", "User Interface", "New Features", "Reliability"],
        is_required: true,
        order_index: 2
      },
      {
        question_text: "Any additional suggestions?",
        question_type: "text" as const,
        is_required: false,
        order_index: 3
      }
    ]
  },

  userExperience: {
    title: "User Experience Survey",
    description: "Tell us about your experience using our platform",
    questions: [
      {
        ...emailQuestionTemplates.emailCapture,
        order_index: 0
      },
      {
        question_text: "How easy was it to complete your task?",
        question_type: "rating" as const,
        is_required: true,
        order_index: 1
      },
      {
        question_text: "Did you encounter any issues?",
        question_type: "yes_no" as const,
        is_required: true,
        order_index: 2
      },
      {
        question_text: "If yes, please describe the issues:",
        question_type: "text" as const,
        is_required: false,
        order_index: 3
      }
    ]
  }
}

// Function to create an email-enabled survey
export async function createEmailEnabledSurvey(
  surveyData: {
    title: string
    description?: string
    userId: string
  },
  template: keyof typeof emailEnabledSurveyTemplates = 'customerFeedback'
) {
  const selectedTemplate = emailEnabledSurveyTemplates[template]
  
  return {
    survey: {
      title: surveyData.title || selectedTemplate.title,
      description: surveyData.description || selectedTemplate.description,
      user_id: surveyData.userId,
      is_published: false
    },
    questions: selectedTemplate.questions
  }
}
