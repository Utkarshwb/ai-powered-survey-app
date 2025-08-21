-- Create surveys table for storing survey metadata
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for surveys table
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for surveys
CREATE POLICY "Users can view their own surveys" ON surveys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create surveys" ON surveys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON surveys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" ON surveys
  FOR DELETE USING (auth.uid() = user_id);

-- Allow public to view published surveys
CREATE POLICY "Public can view published surveys" ON surveys
  FOR SELECT USING (is_published = TRUE);
