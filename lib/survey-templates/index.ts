export interface SurveyTemplate {
  id: string
  name: string
  description: string
  category: string
  questions: TemplateQuestion[]
  estimatedTime: number // in minutes
}

export interface TemplateQuestion {
  question_text: string
  question_type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'email' | 'number'
  is_required: boolean
  options?: string[]
  description?: string
  order_index: number
}

export const surveyTemplates: SurveyTemplate[] = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction with your product or service',
    category: 'Business',
    estimatedTime: 5,
    questions: [
      {
        question_text: 'What is your name?',
        question_type: 'text',
        is_required: false,
        order_index: 1,
      },
      {
        question_text: 'What is your email address?',
        question_type: 'email',
        is_required: false,
        description: 'We\'ll use this to follow up on your feedback',
        order_index: 2,
      },
      {
        question_text: 'How satisfied are you with our product/service?',
        question_type: 'rating',
        is_required: true,
        order_index: 3,
      },
      {
        question_text: 'How likely are you to recommend us to a friend or colleague?',
        question_type: 'rating',
        is_required: true,
        description: 'Rate from 1 (not likely) to 10 (very likely)',
        order_index: 4,
      },
      {
        question_text: 'Which aspect is most important to you?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Ease of use',
          'Customer support', 
          'Price/value',
          'Product quality',
          'Delivery/shipping',
          'Website experience'
        ],
        order_index: 5,
      },
      {
        question_text: 'What could we improve?',
        question_type: 'text',
        is_required: false,
        description: 'Please share any suggestions for improvement',
        order_index: 6,
      }
    ]
  },
  {
    id: 'employee-feedback',
    name: 'Employee Feedback Survey',
    description: 'Gather feedback from employees about workplace satisfaction',
    category: 'HR',
    estimatedTime: 7,
    questions: [
      {
        question_text: 'What is your department?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Engineering',
          'Marketing',
          'Sales',
          'HR',
          'Operations',
          'Finance',
          'Customer Support',
          'Other'
        ],
        order_index: 1,
      },
      {
        question_text: 'How long have you been with the company?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Less than 6 months',
          '6 months - 1 year',
          '1-2 years',
          '2-5 years',
          'More than 5 years'
        ],
        order_index: 2,
      },
      {
        question_text: 'How satisfied are you with your current role?',
        question_type: 'rating',
        is_required: true,
        order_index: 3,
      },
      {
        question_text: 'How would you rate work-life balance?',
        question_type: 'rating',
        is_required: true,
        order_index: 4,
      },
      {
        question_text: 'Do you feel your contributions are valued?',
        question_type: 'multiple_choice',
        is_required: true,
        options: [
          'Strongly agree',
          'Agree',
          'Neutral',
          'Disagree',
          'Strongly disagree'
        ],
        order_index: 5,
      },
      {
        question_text: 'What would motivate you most to stay with the company?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Better compensation',
          'Career advancement opportunities',
          'More flexible working arrangements',
          'Better work-life balance',
          'Professional development',
          'Recognition and appreciation',
          'Better benefits'
        ],
        order_index: 6,
      },
      {
        question_text: 'Any additional feedback or suggestions?',
        question_type: 'text',
        is_required: false,
        order_index: 7,
      }
    ]
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback Survey',
    description: 'Collect user feedback on product features and usability',
    category: 'Product',
    estimatedTime: 6,
    questions: [
      {
        question_text: 'How often do you use our product?',
        question_type: 'multiple_choice',
        is_required: true,
        options: [
          'Daily',
          'Weekly',
          'Monthly',
          'Rarely',
          'This is my first time'
        ],
        order_index: 1,
      },
      {
        question_text: 'What is your primary use case?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Personal use',
          'Small business',
          'Enterprise',
          'Education',
          'Non-profit'
        ],
        order_index: 2,
      },
      {
        question_text: 'Rate the ease of use',
        question_type: 'rating',
        is_required: true,
        description: 'How easy is it to accomplish your goals?',
        order_index: 3,
      },
      {
        question_text: 'Which feature do you use most?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Dashboard',
          'Reports',
          'Settings',
          'Integrations',
          'Mobile app',
          'API'
        ],
        order_index: 4,
      },
      {
        question_text: 'What features are missing that you would like to see?',
        question_type: 'text',
        is_required: false,
        order_index: 5,
      },
      {
        question_text: 'Any bugs or issues you\'ve encountered?',
        question_type: 'text',
        is_required: false,
        description: 'Please describe any problems you\'ve experienced',
        order_index: 6,
      }
    ]
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback Survey',
    description: 'Gather feedback after events, conferences, or workshops',
    category: 'Events',
    estimatedTime: 4,
    questions: [
      {
        question_text: 'What is your name?',
        question_type: 'text',
        is_required: false,
        order_index: 1,
      },
      {
        question_text: 'Your email address (optional)',
        question_type: 'email',
        is_required: false,
        order_index: 2,
      },
      {
        question_text: 'How would you rate the event overall?',
        question_type: 'rating',
        is_required: true,
        order_index: 3,
      },
      {
        question_text: 'Which session was most valuable?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Opening keynote',
          'Technical sessions',
          'Panel discussions',
          'Networking sessions',
          'Workshops',
          'Closing remarks'
        ],
        order_index: 4,
      },
      {
        question_text: 'How likely are you to attend future events?',
        question_type: 'rating',
        is_required: true,
        order_index: 5,
      },
      {
        question_text: 'What topics would you like to see in future events?',
        question_type: 'text',
        is_required: false,
        order_index: 6,
      },
      {
        question_text: 'Any other feedback about the event?',
        question_type: 'text',
        is_required: false,
        order_index: 7,
      }
    ]
  },
  {
    id: 'website-feedback',
    name: 'Website Feedback Survey',
    description: 'Collect user experience feedback for your website',
    category: 'Digital',
    estimatedTime: 3,
    questions: [
      {
        question_text: 'How did you find our website?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Search engine',
          'Social media',
          'Direct link',
          'Referral from friend',
          'Advertisement',
          'Other'
        ],
        order_index: 1,
      },
      {
        question_text: 'What brought you to our website today?',
        question_type: 'multiple_choice',
        is_required: false,
        options: [
          'Looking for information',
          'Making a purchase',
          'Customer support',
          'Browsing',
          'Comparing products'
        ],
        order_index: 2,
      },
      {
        question_text: 'Did you find what you were looking for?',
        question_type: 'multiple_choice',
        is_required: true,
        options: [
          'Yes, completely',
          'Mostly',
          'Partially',
          'No, not at all'
        ],
        order_index: 3,
      },
      {
        question_text: 'Rate the website\'s ease of navigation',
        question_type: 'rating',
        is_required: true,
        order_index: 4,
      },
      {
        question_text: 'What would improve your experience?',
        question_type: 'text',
        is_required: false,
        order_index: 5,
      }
    ]
  }
]

export const getTemplatesByCategory = () => {
  const categories = Array.from(new Set(surveyTemplates.map(t => t.category)))
  return categories.reduce((acc, category) => {
    acc[category] = surveyTemplates.filter(t => t.category === category)
    return acc
  }, {} as Record<string, SurveyTemplate[]>)
}

export const getTemplateById = (id: string) => {
  return surveyTemplates.find(t => t.id === id)
}
