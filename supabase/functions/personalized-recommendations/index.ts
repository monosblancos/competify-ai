import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false },
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' }
        }
      }
    );

    const { profile, userId } = await req.json();

    if (!profile || !userId) {
      throw new Error('Profile and userId are required');
    }

    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    console.log('Generating personalized recommendations for user:', userId);

    // Get all standards for analysis
    const { data: allStandards, error: standardsError } = await supabaseClient
      .from('standards')
      .select('code, title, description, category')
      .limit(50);

    if (standardsError) {
      throw standardsError;
    }

    // Build analysis prompt with user profile
    const analysisPrompt = `Actúa como un consultor experto en desarrollo de competencias profesionales. Analiza el siguiente perfil de usuario y recomienda los 5 estándares de competencia más adecuados.

**PERFIL DEL USUARIO:**
- Nivel educativo: ${profile.education_level || 'No especificado'}
- Experiencias previas: ${(profile.experiences || []).join(', ') || 'No especificadas'}
- Objetivos profesionales: ${(profile.objectives || []).join(', ') || 'No especificados'}
- Sector actual: ${profile.currentSector || 'No especificado'}
- Sector deseado: ${profile.desiredSector || 'No especificado'}
- Expectativa salarial: ${profile.salaryExpectation || 'No especificada'}
- Tiempo disponible: ${profile.timeAvailable || 'No especificado'}

**ESTÁNDARES DISPONIBLES:**
${allStandards?.map(s => `${s.code}: ${s.title} (${s.category})`).join('\n')}

**INSTRUCCIONES:**
1. Selecciona exactamente 5 estándares que mejor se ajusten al perfil
2. Para cada estándar, calcula un score de compatibilidad (0-100)
3. Proporciona razones específicas de la recomendación
4. Estima el impacto salarial esperado
5. Indica la dificultad de obtención

Responde ÚNICAMENTE en formato JSON válido:
{
  "recommendations": [
    {
      "standardCode": "ECXXXX",
      "matchScore": 95,
      "reasons": ["razón 1", "razón 2", "razón 3"],
      "salaryImpact": "Incremento del 30-45%",
      "difficulty": "Medio",
      "timeToComplete": "3-6 meses",
      "roi": 340
    }
  ]
}`;

    // Call Gemini API for analysis
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error('Failed to get recommendations from AI');
    }

    const geminiData = await geminiResponse.json();
    let aiResponse = geminiData.candidates[0].content.parts[0].text;

    // Clean and parse JSON response
    aiResponse = aiResponse.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
    
    let parsedRecommendations;
    try {
      parsedRecommendations = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Enrich recommendations with actual standard data
    const enrichedRecommendations = await Promise.all(
      parsedRecommendations.recommendations.map(async (rec: any) => {
        const standard = allStandards?.find(s => s.code === rec.standardCode);
        
        if (!standard) {
          console.warn(`Standard ${rec.standardCode} not found`);
          return null;
        }

        return {
          standard: {
            code: standard.code,
            title: standard.title,
            description: standard.description,
            category: standard.category
          },
          matchScore: rec.matchScore,
          reasons: rec.reasons,
          salaryImpact: rec.salaryImpact,
          timeToComplete: rec.timeToComplete,
          difficulty: rec.difficulty,
          roi: rec.roi
        };
      })
    );

    // Filter out null results
    const validRecommendations = enrichedRecommendations.filter(rec => rec !== null);

    // Save recommendations to user profile for future reference
    const { error: updateError } = await supabaseClient
      .from('user_profiles')
      .update({
        last_analysis_result: {
          type: 'personalized_recommendations',
          timestamp: new Date().toISOString(),
          recommendations: validRecommendations,
          profile_used: profile
        }
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error saving recommendations:', updateError);
    }

    return new Response(JSON.stringify({
      recommendations: validRecommendations,
      profileAnalyzed: profile,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in personalized-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});