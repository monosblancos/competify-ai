-- Fix security issue: Set proper search_path for the function
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
SECURITY DEFINER
SET search_path = public
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