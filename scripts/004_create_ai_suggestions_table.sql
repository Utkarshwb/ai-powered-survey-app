-- Create ai_suggestions table for storing AI-generated question suggestions
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  suggested_questions JSONB NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for ai_suggestions table
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_suggestions
CREATE POLICY "Users can view AI suggestions for their surveys" ON ai_suggestions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = ai_suggestions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create AI suggestions for their surveys" ON ai_suggestions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = ai_suggestions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(survey_id, order_index);
CREATE INDEX IF NOT EXISTS idx_responses_session_id ON responses(session_id);
CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_survey_id ON survey_sessions(survey_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_survey_id ON ai_suggestions(survey_id);
