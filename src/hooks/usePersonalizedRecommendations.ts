import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  educationLevel: string;
  experience: string[];
  objectives: string[];
  currentSector: string;
  desiredSector: string;
  salaryExpectation: string;
  timeAvailable: string;
  preferredLearning: string;
}

export interface PersonalizedRecommendation {
  standard: {
    code: string;
    title: string;
    description: string;
    category: string;
  };
  matchScore: number;
  reasons: string[];
  salaryImpact: string;
  timeToComplete: string;
  difficulty: 'Bajo' | 'Medio' | 'Alto';
  roi: number;
}

export const usePersonalizedRecommendations = () => {
  const { user, progress } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);

  const analyzeProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!user) return [];

    setIsAnalyzing(true);
    try {
      // Combine user progress data with new input
      const completeProfile = {
        ...progress,
        ...profileData,
        experiences: progress?.experiences || [],
        objectives: profileData.objectives || []
      };

      // Get personalized recommendations using AI
      const { data, error } = await supabase.functions.invoke('personalized-recommendations', {
        body: {
          profile: completeProfile,
          userId: (user as any)?.id || 'anonymous'
        }
      });

      if (error) throw error;

      const personalizedRecs: PersonalizedRecommendation[] = data.recommendations || [];
      setRecommendations(personalizedRecs);
      return personalizedRecs;

    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, progress]);

  const getCareerPathRecommendations = useCallback(async (targetRole: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase.functions.invoke('career-path-analysis', {
        body: {
          targetRole,
          currentProfile: progress,
          userId: (user as any)?.id || 'anonymous'
        }
      });

      if (error) throw error;
      return data.careerPath || [];

    } catch (error) {
      console.error('Error generating career path:', error);
      return [];
    }
  }, [user, progress]);

  const calculateROI = useCallback((standard: any, currentSalary?: number) => {
    // Default salary increases by certification level
    const salaryMultipliers = {
      'Nivel I': 1.15,
      'Nivel II': 1.25,
      'Nivel III': 1.40,
      'Nivel IV': 1.60,
      'Nivel V': 1.80
    };

    const baseCurrentSalary = currentSalary || 25000; // Default MXN
    const multiplier = salaryMultipliers['Nivel III'] || 1.3;
    const projectedSalary = baseCurrentSalary * multiplier;
    const annualIncrease = (projectedSalary - baseCurrentSalary) * 12;
    const certificationCost = 3500; // Average certification cost

    return Math.round((annualIncrease / certificationCost) * 100);
  }, []);

  return {
    recommendations,
    isAnalyzing,
    analyzeProfile,
    getCareerPathRecommendations,
    calculateROI
  };
};