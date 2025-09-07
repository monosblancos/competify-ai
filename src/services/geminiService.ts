import { supabase } from '@/integrations/supabase/client';
import { CVAnalysisResult } from '../types';

interface EnhancedAnalysisData {
  cvText: string;
  experiences: Array<{
    title: string;
    company: string;
    description: string;
  }>;
  objectives: string;
  fullName: string;
  educationLevel: string;
}

export const analyzeCVForCareerPlan = async (data: EnhancedAnalysisData): Promise<CVAnalysisResult> => {
  try {
    // Fetch standards for the AI prompt
    const { data: standards, error: standardsError } = await supabase
      .from('standards')
      .select('code, title, description, category');

    if (standardsError) throw standardsError;

    // Call the analyze-cv-text edge function with enhanced data
    const { data: result, error: functionError } = await supabase.functions.invoke('analyze-cv-text', {
      body: { 
        cvText: data.cvText,
        experiences: data.experiences,
        objectives: data.objectives,
        fullName: data.fullName,
        educationLevel: data.educationLevel,
        standards: standards || []
      }
    });

    if (functionError) throw functionError;

    return result as CVAnalysisResult;
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    throw new Error('Error al realizar el análisis con IA');
  }
};