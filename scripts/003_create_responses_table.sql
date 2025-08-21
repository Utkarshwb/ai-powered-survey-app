-- Create survey_sessions table for tracking response sessions
CREATE TABLE IF NOT EXISTS survey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_email TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT
);

-- Create responses table for storing individual question responses
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES survey_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number NUMERIC,
  answer_boolean BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for survey_sessions table
ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;

-- Enable RLS for responses table
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for survey_sessions
CREATE POLICY "Survey owners can view sessions for their surveys" ON survey_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = survey_sessions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create sessions for published surveys" ON survey_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = survey_sessions.survey_id 
      AND surveys.is_published = TRUE
    )
  );

-- Create RLS policies for responses
CREATE POLICY "Survey owners can view responses for their surveys" ON responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM survey_sessions ss
      JOIN surveys s ON s.id = ss.survey_id
      WHERE ss.id = responses.session_id 
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create responses for published surveys" ON responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_sessions ss
      JOIN surveys s ON s.id = ss.survey_id
      WHERE ss.id = responses.session_id 
      AND s.is_published = TRUE
    )
  );
