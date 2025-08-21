export interface Survey {
  id: string
  title: string
  description?: string
  user_id: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  survey_id: string
  question_text: string
  question_type: "multiple_choice" | "text" | "rating" | "yes_no" | "email" | "number"
  options?: string[]
  is_required: boolean
  order_index: number
  created_at: string
}

export interface SurveySession {
  id: string
  survey_id: string
  respondent_email?: string
  started_at: string
  completed_at?: string
  ip_address?: string
  user_agent?: string
}

export interface Response {
  id: string
  session_id: string
  question_id: string
  answer_text?: string
  answer_number?: number
  answer_boolean?: boolean
  created_at: string
}

export interface AISuggestion {
  id: string
  survey_id: string
  suggested_questions: Question[]
  prompt_used?: string
  created_at: string
}

export interface SurveyWithQuestions extends Survey {
  questions: Question[]
}

export interface SurveyAnalytics {
  total_responses: number
  completion_rate: number
  average_time: number
  response_breakdown: Record<string, any>
}
