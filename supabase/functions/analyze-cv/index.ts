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
    const { fileData, mimeType, standards } = await req.json()
    
    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_AI_API_KEY')!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Actúa como un experto en reclutamiento y en los estándares CONOCER. Analiza el siguiente CV.
      1. Identifica 3-5 fortalezas clave (habilidades blandas o duras).
      2. Identifica 2-3 áreas de oportunidad o habilidades que podrían mejorarse.
      3. De la siguiente lista de estándares, recomienda el MÁS relevante para el perfil: ${JSON.stringify(standards)}.
      
      Devuelve la respuesta ÚNICAMENTE en formato JSON con la siguiente estructura:
      {
        "strengths": ["Fortaleza 1", "Fortaleza 2"],
        "opportunities": ["Oportunidad 1", "Oportunidad 2"], 
        "recommendedStandard": { "code": "ECXXXX", "title": "Título del estándar" }
      }
    `

    const imagePart = {
      inlineData: {
        data: fileData,
        mimeType: mimeType,
      },
    }

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()
    
    // Clean up the response to extract JSON
    const jsonString = text.replace(/```json|```/g, '').trim()
    const parsedResult = JSON.parse(jsonString)

    return new Response(
      JSON.stringify(parsedResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Error analyzing CV' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})