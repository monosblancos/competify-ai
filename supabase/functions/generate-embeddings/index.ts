import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log('Starting embedding generation process...');

    // Get all standards without embeddings
    const { data: standards, error: fetchError } = await supabaseClient
      .from('standards')
      .select('code, title, description, category')
      .is('embedding', null)
      .limit(50); // Process in batches

    if (fetchError) {
      console.error('Error fetching standards:', fetchError);
      throw fetchError;
    }

    if (!standards || standards.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No standards without embeddings found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${standards.length} standards...`);

    let processed = 0;
    let errors = 0;

    for (const standard of standards) {
      try {
        // Create text for embedding: combine title, code, and description
        const textToEmbed = `${standard.code}: ${standard.title}. ${standard.description || ''}`.trim();

        // Generate embedding using OpenAI
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: textToEmbed,
            dimensions: 1536
          }),
        });

        if (!embeddingResponse.ok) {
          const errorText = await embeddingResponse.text();
          console.error(`OpenAI API Error for ${standard.code}:`, errorText);
          errors++;
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Update the standard with its embedding
        const { error: updateError } = await supabaseClient
          .from('standards')
          .update({ embedding })
          .eq('code', standard.code);

        if (updateError) {
          console.error(`Error updating ${standard.code}:`, updateError);
          errors++;
        } else {
          processed++;
          console.log(`Successfully processed ${standard.code} (${processed}/${standards.length})`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${standard.code}:`, error);
        errors++;
      }
    }

    const result = {
      message: `Embedding generation completed`,
      processed,
      errors,
      total: standards.length
    };

    console.log('Final result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-embeddings function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Error generating embeddings for standards'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});