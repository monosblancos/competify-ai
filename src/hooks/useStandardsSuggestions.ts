import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StandardSuggestion {
  code: string;
  title: string;
}

export const useStandardsSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<StandardSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Check if it's an exact standard code match
        const standardCodeMatch = query.match(/^EC\d{4}$/i);
        
        let supabaseQuery;
        
        if (standardCodeMatch) {
          // Search for exact code match
          supabaseQuery = supabase
            .from('standards')
            .select('code, title')
            .ilike('code', `${standardCodeMatch[0]}%`)
            .limit(8);
        } else {
          // Search by title and code
          supabaseQuery = supabase
            .from('standards')
            .select('code, title')
            .or(`title.ilike.%${query}%,code.ilike.%${query}%`)
            .limit(8);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          return;
        }

        setSuggestions(data || []);
      } catch (error) {
        console.error('Error in fetchSuggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    timeoutId = setTimeout(fetchSuggestions, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return { suggestions, isLoading };
};