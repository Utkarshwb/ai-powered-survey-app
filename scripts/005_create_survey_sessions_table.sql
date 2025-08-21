-- Create survey_sessions table for tracking response sessions
CREATE TABLE IF NOT EXISTS survey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Enable RLS for survey_sessions table
ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for survey_sessions
CREATE POLICY "Survey owners can view sessions" ON survey_sessions
  FOR SELECT USING (
    survey_id IN (
      SELECT id FROM surveys WHERE user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_survey_sessions_survey_id ON survey_sessions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_token ON survey_sessions(session_token);
