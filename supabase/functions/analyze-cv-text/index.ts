import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.15.0"

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

    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_AI_API_KEY')!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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

    console.log('Analyzing CV text with Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini response:', text)
    
    // Clean up the response to extract JSON
    const jsonString = text.replace(/```json|```/g, '').trim()
    const parsedResult = JSON.parse(jsonString)

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
      JSON.stringify({ error: 'Error analyzing CV text' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})