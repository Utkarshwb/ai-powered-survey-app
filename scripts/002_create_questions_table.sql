-- Create questions table for storing survey questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'text', 'rating', 'yes_no', 'email', 'number')),
  options JSONB, -- For multiple choice options
  is_required BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for questions
CREATE POLICY "Users can view questions for their surveys" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for their surveys" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for their surveys" ON questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for their surveys" ON questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.user_id = auth.uid()
    )
  );

-- Allow public to view questions for published surveys
CREATE POLICY "Public can view questions for published surveys" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = questions.survey_id 
      AND surveys.is_published = TRUE
    )
  );
