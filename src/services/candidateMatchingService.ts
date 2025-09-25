import { supabase } from '@/integrations/supabase/client';

export interface MatchingCriteria {
  requiredStandards?: string[];
  location?: string;
  experience?: string[];
  educationLevel?: string;
  objectives?: string;
  availableForRemote?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  educationLevel: string;
  objectives: string;
  experiences: any[];
  certifications: string[];
  completionRate: number;
  matchScore: number;
  matchReasons: string[];
}

export interface MatchingResponse {
  candidates: CandidateProfile[];
  totalMatches: number;
  searchCriteria: MatchingCriteria;
}

export class CandidateMatchingService {
  static async findCandidates(
    criteria: MatchingCriteria, 
    limit: number = 10
  ): Promise<MatchingResponse> {
    try {
      console.log('Searching candidates with criteria:', criteria);

      const { data, error } = await supabase.functions.invoke('company-candidate-matching', {
        body: {
          criteria,
          limit
        }
      });

      if (error) {
        console.error('Error calling matching function:', error);
        throw new Error('Failed to search candidates');
      }

      return data as MatchingResponse;
    } catch (error) {
      console.error('Error in findCandidates:', error);
      throw error;
    }
  }

  static async findCandidatesForJobOpening(jobId: string): Promise<MatchingResponse> {
    try {
      // Get job opening details
      const { data: jobOpening, error: jobError } = await supabase
        .from('job_openings')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) {
        console.error('Error fetching job opening:', jobError);
        throw new Error('Failed to fetch job opening');
      }

      // Build matching criteria from job opening
      const criteria: MatchingCriteria = {
        requiredStandards: jobOpening.required_standards || [],
        location: jobOpening.location,
        objectives: jobOpening.description
      };

      return await this.findCandidates(criteria, 20);
    } catch (error) {
      console.error('Error in findCandidatesForJobOpening:', error);
      throw error;
    }
  }

  static getEducationLevels(): string[] {
    return [
      'Secundaria',
      'Preparatoria', 
      'Técnica',
      'Licenciatura',
      'Maestría',
      'Doctorado'
    ];
  }

  static getExperienceAreas(): string[] {
    return [
      'Capacitación',
      'Recursos Humanos',
      'Educación',
      'Consultoría',
      'Gestión de Proyectos',
      'Evaluación',
      'Diseño Instruccional',
      'E-learning',
      'Desarrollo Organizacional',
      'Coaching'
    ];
  }
}