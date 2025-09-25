import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BusinessChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BusinessChatSession {
  id: string;
  messages: BusinessChatMessage[];
  company_info?: {
    name?: string;
    industry?: string;
    size?: string;
    contact?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, companyInfo } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get relevant standards for business context
    const { data: standards } = await supabase.rpc('search_standards_by_text', {
      search_query: message,
      match_count: 5
    });

    // Get or create business chat session
    let session: BusinessChatSession;
    if (sessionId) {
      const { data: existingSession } = await supabase
        .from('business_chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      session = existingSession || { id: crypto.randomUUID(), messages: [], company_info: companyInfo };
    } else {
      session = { id: crypto.randomUUID(), messages: [], company_info: companyInfo };
    }

    // Add user message to session
    session.messages.push({ role: 'user', content: message });

    // Create business-focused prompt
    const systemPrompt = `Eres un consultor empresarial especializado en certificaciones de competencias laborales. Tu objetivo es:

1. ASESORAR sobre certificaciones que beneficien específicamente a empresas
2. GENERAR LEADS cualificados identificando necesidades reales
3. PERSONALIZAR recomendaciones según el sector y tamaño de empresa
4. CREAR URGENCIA mostrando el ROI y ventajas competitivas

CONTEXTO DE ESTÁNDARES DISPONIBLES:
${standards?.map(s => `- ${s.code}: ${s.title} (${s.category})`).join('\n') || 'No hay estándares específicos encontrados'}

INFORMACIÓN DE LA EMPRESA:
${session.company_info ? `
- Nombre: ${session.company_info.name || 'No especificado'}
- Industria: ${session.company_info.industry || 'No especificada'}
- Tamaño: ${session.company_info.size || 'No especificado'}
- Contacto: ${session.company_info.contact || 'No especificado'}
` : 'Información no proporcionada'}

ESTRATEGIAS CLAVE:
- Enfócate en ROI y reducción de costos
- Menciona ventajas competitivas específicas
- Sugiere certificaciones por equipos/departamentos
- Identifica gaps de competencias críticos
- Propón planes de implementación escalables

Si detectas interés real, sugiere una consultoría personalizada y solicita datos de contacto.

Responde de manera profesional, práctica y orientada a resultados empresariales.`;

    const conversationHistory = session.messages.slice(-10); // Last 10 messages

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // Add assistant response to session
    session.messages.push({ role: 'assistant', content: assistantMessage });

    // Save session to database
    await supabase
      .from('business_chat_sessions')
      .upsert({
        id: session.id,
        messages: session.messages,
        company_info: session.company_info,
        updated_at: new Date().toISOString()
      });

    // Detect if this is a qualified lead
    const isQualifiedLead = assistantMessage.toLowerCase().includes('consultoría') || 
                           assistantMessage.toLowerCase().includes('contacto') ||
                           message.toLowerCase().includes('presupuesto') ||
                           message.toLowerCase().includes('implementar');

    return new Response(JSON.stringify({
      message: assistantMessage,
      sessionId: session.id,
      relevantStandards: standards || [],
      isQualifiedLead,
      context: {
        standardsFound: standards?.length || 0,
        companyInfoComplete: !!(session.company_info?.name && session.company_info?.industry)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in business chatbot:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al procesar la consulta empresarial',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});