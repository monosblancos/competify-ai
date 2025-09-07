-- Enable the pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to standards table for semantic search
ALTER TABLE public.standards 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create an index for faster similarity search
CREATE INDEX IF NOT EXISTS standards_embedding_idx 
ON public.standards 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create a function to search standards by similarity
CREATE OR REPLACE FUNCTION search_standards_by_similarity(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  code text,
  title text,
  description text,
  category text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.code,
    s.title,
    s.description, 
    s.category,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM standards s
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create chat sessions table for conversational memory
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  session_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on chat sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat sessions
CREATE POLICY "Users can manage their own chat sessions"
ON public.chat_sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();