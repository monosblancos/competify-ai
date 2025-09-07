import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Standard {
  code: string;
  title: string;
  description: string;
  category: string;
}

export const useStandardsSearch = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchStandards = async (query: string, category?: string): Promise<Standard[]> => {
    setIsSearching(true);
    
    try {
      let supabaseQuery = supabase
        .from('standards')
        .select('code, title, description, category');

      // Search by title, description, or code
      if (query) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`
        );
      }

      // Filter by category if provided
      if (category) {
        supabaseQuery = supabaseQuery.ilike('category', `%${category}%`);
      }

      const { data, error } = await supabaseQuery
        .limit(10)
        .order('title', { ascending: true });

      if (error) {
        console.error('Error searching standards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchStandards:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const searchByKeywords = async (keywords: string[]): Promise<Standard[]> => {
    setIsSearching(true);
    
    try {
      // Create OR conditions for each keyword
      const conditions = keywords.flatMap(keyword => [
        `title.ilike.%${keyword}%`,
        `description.ilike.%${keyword}%`
      ]).join(',');

      const { data, error } = await supabase
        .from('standards')
        .select('code, title, description, category')
        .or(conditions)
        .limit(8)
        .order('title', { ascending: true });

      if (error) {
        console.error('Error searching standards by keywords:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchByKeywords:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const getRandomStandards = async (count: number = 3): Promise<Standard[]> => {
    try {
      const { data, error } = await supabase
        .from('standards')
        .select('code, title, description, category')
        .limit(count);

      if (error) {
        console.error('Error getting random standards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRandomStandards:', error);
      return [];
    }
  };

  return {
    searchStandards,
    searchByKeywords,
    getRandomStandards,
    isSearching
  };
};