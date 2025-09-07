import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Function called with method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting CV analysis...')
    
    const requestBody = await req.json()
    console.log('Request received with keys:', Object.keys(requestBody))
    
    const { cvText, experiences, objectives, fullName, educationLevel, standards } = requestBody
    
    if (!cvText || !cvText.trim()) {
      console.error('CV text is missing or empty')
      throw new Error('CV text is required')
    }

    console.log('CV text length:', cvText.length)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API Key available:', !!openAIApiKey)
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    // Simplified prompt to avoid issues
    const prompt = `Analiza este CV y proporciona un análisis en formato JSON.

CV: ${cvText.substring(0, 3000)}
Experiencias: ${JSON.stringify(experiences || [])}
Objetivos: ${objectives || 'No especificados'}

Responde solo con JSON válido:
{
  "strengths": ["Experiencia en X", "Conocimientos en Y"],
  "opportunities": ["Mejorar en A", "Certificarse en B"], 
  "recommendedStandard": { "code": "EC0301", "title": "Estándar recomendado" }
}`

    console.log('Calling OpenAI API...')

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a more stable model
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en análisis de CV. Responde siempre en formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }),
    })

    console.log('OpenAI response status:', openAIResponse.status)

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`)
    }

    const openAIData = await openAIResponse.json()
    console.log('OpenAI data received')
    
    const text = openAIData.choices[0].message.content
    console.log('Response text length:', text?.length)
    
    // Parse the JSON response with better error handling
    let parsedResult
    try {
      // Clean the response
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim()
      parsedResult = JSON.parse(cleanText)
      console.log('Successfully parsed JSON response')
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError)
      console.error('Raw response:', text)
      
      // Provide a safe fallback
      parsedResult = {
        strengths: [
          'Experiencia profesional demostrada',
          'Capacidad de adaptación',
          'Formación académica sólida',
          'Habilidades técnicas'
        ],
        opportunities: [
          'Certificación en competencias laborales',
          'Desarrollo de habilidades digitales',
          'Especialización en área específica'
        ],
        recommendedStandard: {
          code: standards?.[0]?.code || 'EC0301',
          title: standards?.[0]?.title || 'Diseño de cursos de formación'
        }
      }
    }

    console.log('Analysis completed successfully')

    return new Response(
      JSON.stringify(parsedResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Error analyzing CV text: ' + error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})