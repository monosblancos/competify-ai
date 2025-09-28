import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    console.log('Processing RAG chatbot request:', { message, sessionId });

    // Step 1: Always start with text search (more reliable)
    console.log('Starting with direct text search...');
    let similarStandards: any[] = [];

    try {
      const { data: textResults, error: textError } = await supabaseClient
        .rpc('search_standards_by_text', {
          search_query: message,
          match_count: 5
        });

      if (textError) {
        console.error('Text search error:', textError);
      } else {
        similarStandards = (textResults || []).map((standard: any) => ({
          ...standard,
          similarity: 0.8 // Default high similarity for text matches
        }));
        console.log(`Found ${similarStandards.length} standards via text search`);
      }
    } catch (error) {
      console.error('Text search failed:', error);
    }

    // Step 2: Try vector search only if OpenAI key is available and text search didn't find much
    if (similarStandards.length < 3 && openAIApiKey) {
      console.log('Attempting vector search as supplement...');
      try {
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: message
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          const queryEmbedding = embeddingData.data[0].embedding;

          const { data: vectorResults, error: vectorError } = await supabaseClient
            .rpc('search_standards_by_similarity', {
              query_embedding: queryEmbedding,
              match_threshold: 0.5,
              match_count: 5
            });

          if (!vectorError && vectorResults && vectorResults.length > 0) {
            // Merge results, avoiding duplicates
            const existingCodes = new Set(similarStandards.map(s => s.code));
            const newResults = vectorResults.filter((s: any) => !existingCodes.has(s.code));
            similarStandards = [...similarStandards, ...newResults];
            console.log(`Added ${newResults.length} more standards via vector search`);
          }
        } else {
          console.warn('Vector search failed, continuing with text results');
        }
      } catch (error) {
        console.warn('Vector search failed, continuing with text results:', error);
      }
    }

    console.log(`Found ${similarStandards?.length || 0} similar standards total`);

    // Step 3: If no specific standards found, provide general guidance with contact info
    if (!similarStandards || similarStandards.length === 0) {
      console.log('No specific standards found, providing general guidance');
      
      const generalResponse = `¡Hola! Soy el asistente de Certifica Global. 

No encontré estándares específicos para tu consulta "${message}", pero puedo ayudarte de otras formas:

🔍 **Explora nuestros estándares**: Navega por nuestra lista completa de estándares de competencia
📋 **Análisis personalizado**: Sube tu CV para obtener recomendaciones específicas
💼 **Oportunidades laborales**: Revisa las vacantes disponibles

📞 **¿Necesitas ayuda personalizada?**
• Email: administracion@certificaglobal.com  
• WhatsApp: 5527672486

¿En qué área específica te gustaría certificarte? Puedo sugerirte estándares por sector como tecnología, administración, ventas, etc.`;

      return new Response(JSON.stringify({
        message: generalResponse,
        sessionId: sessionId || crypto.randomUUID(),
        relevantStandards: [],
        context: {
          standardsFound: 0,
          searchQuery: message,
          responseType: 'general_guidance'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 4: Get or create chat session
    let chatSession: ChatSession;
    
    if (sessionId) {
      const { data: existingSession } = await supabaseClient
        .from('chat_sessions')
        .select('session_data')
        .eq('id', sessionId)
        .single();
      
      chatSession = existingSession?.session_data || { id: sessionId, messages: [] };
    } else {
      chatSession = { id: crypto.randomUUID(), messages: [] };
    }

    // Step 5: Build context from similar standards
    const contextText = similarStandards && similarStandards.length > 0
      ? similarStandards.map(standard => 
          `**[${standard.code}]**: ${standard.title}\n*Categoría: ${standard.category}*\n${standard.description}\n---`
        ).join('\n')
      : 'No se encontraron estándares relevantes en la base de datos.';

    // Step 6: Build conversation history for context
    const conversationHistory = chatSession.messages
      .slice(-6) // Keep last 6 messages for context
      .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
      .join('\n');

    // Step 7: Create augmented prompt
    const augmentedPrompt = `Actúa como un asesor experto en competencias laborales de Certifica Global. Tu conocimiento se limita ESTRICTAMENTE a la información de contexto proporcionada.

**INSTRUCCIONES CRÍTICAS:**
- Solo usa información de los estándares proporcionados en el contexto
- Si no encuentras información relevante, responde: "No encontré información sobre eso en mi base de conocimiento de Certifica Global"
- SIEMPRE cita los códigos de estándares usando el formato [CÓDIGO] (ej: [EC0076], [EC0301])
- Proporciona información práctica sobre certificaciones y competencias
- Para consultas generales sobre certificación, menciona nuestros datos de contacto:
  * Email: administracion@certificaglobal.com
  * WhatsApp: 5527672486

**CONTEXTO (Estándares de Competencia Relevantes):**
${contextText}

**HISTORIAL DE CONVERSACIÓN:**
${conversationHistory}

**PREGUNTA ACTUAL DEL USUARIO:**
${message}

**TU RESPUESTA (basada EXCLUSIVAMENTE en el contexto):**`;

    // Step 8: Call Gemini API
    console.log('Calling Gemini API...');
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: augmentedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      throw new Error('Failed to generate response');
    }

    const geminiData = await geminiResponse.json();
    const assistantResponse = geminiData.candidates[0].content.parts[0].text;

    // Step 9: Update chat session with new messages
    chatSession.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: assistantResponse }
    );

    // Keep only last 10 messages to prevent session from growing too large
    if (chatSession.messages.length > 10) {
      chatSession.messages = chatSession.messages.slice(-10);
    }

    // Step 10: Save/update chat session
    const { error: sessionError } = await supabaseClient
      .from('chat_sessions')
      .upsert({
        id: chatSession.id,
        session_data: chatSession,
        updated_at: new Date().toISOString()
      });

    if (sessionError) {
      console.error('Session save error:', sessionError);
      // Don't throw here, just log - the response is still valid
    }

    // Step 11: Return response with relevant standards
    const response = {
      message: assistantResponse,
      sessionId: chatSession.id,
      relevantStandards: similarStandards?.slice(0, 5) || [],
      context: {
        standardsFound: similarStandards?.length || 0,
        searchQuery: message
      }
    };

    console.log('RAG chatbot response generated successfully');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rag-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Lo siento, hubo un error procesando tu consulta. Por favor intenta nuevamente.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
