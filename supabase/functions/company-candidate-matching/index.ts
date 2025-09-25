import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchingCriteria {
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

interface CandidateProfile {
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { criteria, limit = 10 }: { criteria: MatchingCriteria; limit?: number } = await req.json();

    console.log('Matching criteria:', criteria);

    // Get all user profiles with their progress
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .not('full_name', 'is', null)
      .not('email', 'is', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error('Failed to fetch user profiles');
    }

    console.log(`Found ${profiles?.length || 0} profiles`);

    // Get standards data for certification details
    const { data: standards, error: standardsError } = await supabase
      .from('standards')
      .select('code, title, category');

    if (standardsError) {
      console.error('Error fetching standards:', standardsError);
      throw new Error('Failed to fetch standards data');
    }

    const standardsMap = new Map(standards?.map(s => [s.code, s]) || []);

    // Process and score candidates
    const candidates: CandidateProfile[] = [];

    for (const profile of profiles || []) {
      const progress = profile.progress || {};
      const certifications: string[] = [];
      let totalModules = 0;
      let completedModules = 0;

      // Calculate certifications and completion rate
      for (const [standardCode, progressData] of Object.entries(progress)) {
        if (progressData && typeof progressData === 'object') {
          const completedCount = (progressData as any).completedModules?.length || 0;
          
          if (completedCount > 0) {
            certifications.push(standardCode);
            
            // Estimate total modules (you might want to get this from standards data)
            const estimatedTotal = 3; // Most standards have ~3 modules
            totalModules += estimatedTotal;
            completedModules += completedCount;
          }
        }
      }

      const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

      // Calculate match score
      let matchScore = 0;
      const matchReasons: string[] = [];

      // Standard matching (highest weight)
      if (criteria.requiredStandards && criteria.requiredStandards.length > 0) {
        const matchingStandards = certifications.filter(cert => 
          criteria.requiredStandards!.includes(cert)
        );
        
        if (matchingStandards.length > 0) {
          matchScore += (matchingStandards.length / criteria.requiredStandards.length) * 50;
          matchReasons.push(`Certificado en ${matchingStandards.length} de ${criteria.requiredStandards.length} estándares requeridos`);
          
          matchingStandards.forEach(code => {
            const standard = standardsMap.get(code);
            if (standard) {
              matchReasons.push(`✓ ${standard.title}`);
            }
          });
        }
      }

      // Education level matching
      if (criteria.educationLevel && profile.education_level) {
        const educationLevels = [
          'Secundaria',
          'Preparatoria',
          'Técnica',
          'Licenciatura',
          'Maestría',
          'Doctorado'
        ];
        
        const requiredIndex = educationLevels.indexOf(criteria.educationLevel);
        const candidateIndex = educationLevels.indexOf(profile.education_level);
        
        if (candidateIndex >= requiredIndex) {
          matchScore += 15;
          matchReasons.push(`Nivel educativo: ${profile.education_level}`);
        }
      }

      // Experience matching
      if (criteria.experience && profile.experiences && Array.isArray(profile.experiences)) {
        const hasRelevantExperience = profile.experiences.some((exp: any) => 
          criteria.experience!.some((reqExp: string) => 
            String(exp).toLowerCase().includes(reqExp.toLowerCase())
          )
        );
        
        if (hasRelevantExperience) {
          matchScore += 20;
          matchReasons.push('Experiencia relevante encontrada');
        }
      }

      // Objectives alignment
      if (criteria.objectives && profile.objectives) {
        const objectiveWords = criteria.objectives.toLowerCase().split(' ');
        const profileObjectives = profile.objectives.toLowerCase();
        
        const alignmentScore = objectiveWords.filter(word => 
          profileObjectives.includes(word)
        ).length / objectiveWords.length;
        
        if (alignmentScore > 0.3) {
          matchScore += alignmentScore * 15;
          matchReasons.push('Objetivos profesionales alineados');
        }
      }

      // Completion rate bonus
      if (completionRate > 70) {
        matchScore += 10;
        matchReasons.push(`Alta tasa de completación: ${completionRate.toFixed(1)}%`);
      } else if (completionRate > 50) {
        matchScore += 5;
        matchReasons.push(`Tasa de completación: ${completionRate.toFixed(1)}%`);
      }

      // Only include candidates with some match
      if (matchScore > 10) {
        candidates.push({
          id: profile.id,
          fullName: profile.full_name || 'Nombre no disponible',
          email: profile.email || '',
          phone: profile.phone || '',
          educationLevel: profile.education_level || 'No especificado',
          objectives: profile.objectives || 'No especificado',
          experiences: profile.experiences || [],
          certifications,
          completionRate: Math.round(completionRate),
          matchScore: Math.round(matchScore),
          matchReasons
        });
      }
    }

    // Sort by match score and limit results
    const topCandidates = candidates
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    console.log(`Returning ${topCandidates.length} matched candidates`);

    return new Response(
      JSON.stringify({
        candidates: topCandidates,
        totalMatches: candidates.length,
        searchCriteria: criteria
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in company-candidate-matching function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        candidates: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});