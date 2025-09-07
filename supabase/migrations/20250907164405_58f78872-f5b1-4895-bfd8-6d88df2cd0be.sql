-- Replace the current function with a more robust version for better semantic search
CREATE OR REPLACE FUNCTION public.search_standards_by_similarity(
  query_embedding vector, 
  match_threshold double precision DEFAULT 0.5, 
  match_count integer DEFAULT 10
)
RETURNS TABLE(
  code text, 
  title text, 
  description text, 
  category text, 
  similarity double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Create a fallback text search function for when semantic search fails
CREATE OR REPLACE FUNCTION public.search_standards_by_text(
  search_query text,
  match_count integer DEFAULT 5
)
RETURNS TABLE(
  code text,
  title text,
  description text,
  category text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.code,
    s.title,
    s.description,
    s.category
  FROM standards s
  WHERE 
    s.title ILIKE '%' || search_query || '%' OR
    s.description ILIKE '%' || search_query || '%' OR
    s.code ILIKE '%' || search_query || '%' OR
    s.category ILIKE '%' || search_query || '%'
  ORDER BY
    CASE 
      WHEN s.title ILIKE '%' || search_query || '%' THEN 1
      WHEN s.code ILIKE '%' || search_query || '%' THEN 2
      WHEN s.category ILIKE '%' || search_query || '%' THEN 3
      ELSE 4
    END,
    s.title
  LIMIT match_count;
END;
$$;