import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cvText, experiences, objectives, fullName, educationLevel, standards } = await req.json()
    
    if (!cvText || !cvText.trim()) {
      throw new Error('CV text is required')
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
      Eres un experto en desarrollo profesional y análisis de competencias laborales. Analiza el perfil completo de este profesional mexicano considerando TODA su información.

      INFORMACIÓN DEL PROFESIONAL:
      Nombre: ${fullName || 'No proporcionado'}
      Nivel Educativo: ${educationLevel || 'No proporcionado'}
      
      TEXTO DEL CV:
      ---
      ${cvText}
      ---

      EXPERIENCIA LABORAL ESTRUCTURADA:
      ---
      ${experiences && experiences.length > 0 ? JSON.stringify(experiences, null, 2) : 'No se proporcionó experiencia estructurada'}
      ---

      OBJETIVOS PROFESIONALES:
      ---
      ${objectives || 'No se proporcionaron objetivos específicos'}
      ---

      ESTÁNDARES DISPONIBLES: ${JSON.stringify(standards?.slice(0, 20))}
      
      Devuelve la respuesta ÚNICAMENTE en formato JSON:
      {
        "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3", "Fortaleza 4"],
        "opportunities": ["Oportunidad 1", "Oportunidad 2", "Oportunidad 3"], 
        "recommendedStandard": { "code": "ECXXXX", "title": "Título del estándar" }
      }
    `

    console.log('Analyzing CV text with OpenAI...')

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto consultor en competencias laborales y análisis de CV. Proporciona análisis detallados y recomendaciones específicas basadas en estándares de competencia CONOCER.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    })

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${openAIResponse.status}`)
    }

    const openAIData = await openAIResponse.json()
    const text = openAIData.choices[0].message.content
    
    console.log('OpenAI response:', text)
    
    // Parse the JSON response
    let parsedResult
    try {
      parsedResult = JSON.parse(text)
    } catch (parseError) {
      console.error('Error parsing OpenAI JSON response:', parseError)
      // Fallback analysis if JSON parsing fails
      parsedResult = {
        strengths: ['Experiencia profesional relevante', 'Capacidad de adaptación', 'Formación académica sólida'],
        opportunities: ['Certificación en competencias específicas', 'Desarrollo de habilidades digitales', 'Especialización sectorial'],
        recommendedStandard: standards?.[0] ? { code: standards[0].code, title: standards[0].title } : { code: 'EC0301', title: 'Diseño de cursos de formación' }
      }
    }

    console.log('Parsed analysis result:', parsedResult)

    return new Response(
      JSON.stringify(parsedResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error analyzing CV text:', error)
    return new Response(
      JSON.stringify({ error: 'Error analyzing CV text: ' + error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})