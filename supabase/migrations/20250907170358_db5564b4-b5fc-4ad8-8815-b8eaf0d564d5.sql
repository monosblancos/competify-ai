-- Fix the text search function to be more flexible and case-insensitive
CREATE OR REPLACE FUNCTION public.search_standards_by_text(search_query text, match_count integer DEFAULT 5)
RETURNS TABLE(code text, title text, description text, category text)
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
    LOWER(s.title) LIKE LOWER('%' || search_query || '%') OR
    LOWER(s.description) LIKE LOWER('%' || search_query || '%') OR
    LOWER(s.code) LIKE LOWER('%' || search_query || '%') OR
    LOWER(s.category) LIKE LOWER('%' || search_query || '%') OR
    -- Add more flexible matching for technology-related terms
    (LOWER(search_query) LIKE '%tecnolog%' AND (
      LOWER(s.title) LIKE '%formaci%' OR 
      LOWER(s.title) LIKE '%línea%' OR
      LOWER(s.title) LIKE '%digital%' OR
      LOWER(s.category) LIKE '%educación%'
    )) OR
    -- Add matching for certification terms
    (LOWER(search_query) LIKE '%certificar%' AND (
      LOWER(s.title) LIKE '%competencia%' OR
      LOWER(s.title) LIKE '%evaluaci%' OR
      LOWER(s.category) LIKE '%evaluaci%'
    )) OR
    -- Add matching for training terms
    (LOWER(search_query) LIKE '%capacita%' AND (
      LOWER(s.title) LIKE '%formaci%' OR
      LOWER(s.title) LIKE '%curso%' OR
      LOWER(s.category) LIKE '%educación%'
    ))
  ORDER BY
    CASE 
      WHEN LOWER(s.title) LIKE LOWER('%' || search_query || '%') THEN 1
      WHEN LOWER(s.code) LIKE LOWER('%' || search_query || '%') THEN 2
      WHEN LOWER(s.category) LIKE LOWER('%' || search_query || '%') THEN 3
      ELSE 4
    END,
    s.title
  LIMIT match_count;
END;
$$;