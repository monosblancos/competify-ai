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

    if (!openAIApiKey || !geminiApiKey) {
      throw new Error('API keys not found');
    }

    console.log('Processing RAG chatbot request:', { message, sessionId });

    // Step 1: Generate embedding for user's message
    console.log('Generating embedding for user message...');
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

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('OpenAI Embedding Error:', errorText);
      throw new Error(`Failed to generate embedding: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 2: Search for similar standards using the function
    console.log('Searching for similar standards...');
    const { data: similarStandards, error: searchError } = await supabaseClient
      .rpc('search_standards_by_similarity', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 8
      });

    if (searchError) {
      console.error('Search error:', searchError);
      throw searchError;
    }

    console.log(`Found ${similarStandards?.length || 0} similar standards`);

    // Check if we have any standards with embeddings
    if (!similarStandards || similarStandards.length === 0) {
      const { data: embeddingCheck } = await supabaseClient
        .from('standards')
        .select('code')
        .not('embedding', 'is', null)
        .limit(1);
      
      if (!embeddingCheck || embeddingCheck.length === 0) {
        console.warn('No embeddings found in standards table');
        return new Response(JSON.stringify({
          message: 'El sistema de recomendaciones inteligentes aún se está inicializando. Por favor, utiliza el botón "Inicializar RAG" para configurar la base de conocimientos, o realiza una búsqueda manual en nuestra lista de estándares.',
          sessionId: sessionId || crypto.randomUUID(),
          relevantStandards: [],
          context: {
            standardsFound: 0,
            searchQuery: message,
            systemStatus: 'embeddings_not_initialized'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Step 3: Get or create chat session
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

    // Step 4: Build context from similar standards
    const contextText = similarStandards && similarStandards.length > 0
      ? similarStandards.map(standard => 
          `**${standard.code}**: ${standard.title}\n*Categoría: ${standard.category}*\n${standard.description}\n---`
        ).join('\n')
      : 'No se encontraron estándares relevantes en la base de datos.';

    // Step 5: Build conversation history for context
    const conversationHistory = chatSession.messages
      .slice(-6) // Keep last 6 messages for context
      .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
      .join('\n');

    // Step 6: Create augmented prompt
    const augmentedPrompt = `Actúa como un asesor experto en competencias laborales de Certifica Global. Tu conocimiento se limita ESTRICTAMENTE a la información de contexto proporcionada. NUNCA inventes información.

**INSTRUCCIONES CRÍTICAS:**
- Solo usa información de los estándares proporcionados
- Si la respuesta no está en el contexto, di "No tengo información suficiente en mi base de datos"
- Siempre cita los códigos y nombres exactos de los estándares
- Proporciona información práctica sobre certificaciones y competencias

**CONTEXTO (Estándares de Competencia Relevantes):**
${contextText}

**HISTORIAL DE CONVERSACIÓN:**
${conversationHistory}

**PREGUNTA ACTUAL DEL USUARIO:**
${message}

**TU RESPUESTA (basada EXCLUSIVAMENTE en el contexto):**`;

    // Step 7: Call Gemini API
    console.log('Calling Gemini API...');
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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

    // Step 8: Update chat session with new messages
    chatSession.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: assistantResponse }
    );

    // Keep only last 10 messages to prevent session from growing too large
    if (chatSession.messages.length > 10) {
      chatSession.messages = chatSession.messages.slice(-10);
    }

    // Step 9: Save/update chat session
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

    // Step 10: Return response with relevant standards
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
      error: error.message,
      message: 'Lo siento, hubo un error procesando tu consulta. Por favor intenta nuevamente.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
