import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StandardImport {
  code: string;
  title: string;
  nivel?: number;
  comite?: string;
  sector: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { standards, clearExisting = false } = await req.json();

    if (!standards || !Array.isArray(standards)) {
      return new Response(
        JSON.stringify({ error: 'Se requiere un array de estándares' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🚀 Iniciando importación de ${standards.length} estándares...`);

    // Opción para limpiar tabla existente
    if (clearExisting) {
      console.log('🗑️ Limpiando tabla standards...');
      const { error: deleteError } = await supabaseClient
        .from('standards')
        .delete()
        .neq('code', ''); // Elimina todos

      if (deleteError) {
        console.error('Error limpiando tabla:', deleteError);
      }
    }

    let imported = 0;
    let errors = 0;
    const errorDetails: any[] = [];

    // Procesar en lotes de 100 para eficiencia
    const batchSize = 100;
    for (let i = 0; i < standards.length; i += batchSize) {
      const batch = standards.slice(i, i + batchSize);
      
      // Transformar datos para inserción
      const formattedBatch = batch.map((std: StandardImport) => ({
        code: std.code,
        title: std.title,
        description: `${std.title}${std.comite ? '. Comité: ' + std.comite : ''}`,
        category: std.sector || 'OTROS SERVICIOS',
        modules: [],
        is_core_offering: false
      }));

      try {
        const { data, error } = await supabaseClient
          .from('standards')
          .upsert(formattedBatch, { 
            onConflict: 'code',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`❌ Error en batch ${i}-${i + batchSize}:`, error);
          errors += batch.length;
          errorDetails.push({
            batch: `${i}-${i + batchSize}`,
            error: error.message
          });
        } else {
          imported += batch.length;
          console.log(`✅ Importados ${imported}/${standards.length}`);
        }
      } catch (batchError) {
        console.error(`❌ Exception en batch ${i}:`, batchError);
        errors += batch.length;
      }

      // Pequeña pausa para no saturar la DB
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const result = {
      success: true,
      imported,
      errors,
      total: standards.length,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined
    };

    console.log('📊 Resultado final:', result);

    // Si la importación fue exitosa, disparar generación de embeddings en background
    if (imported > 0) {
      console.log('🔮 Iniciando generación de embeddings en background...');
      
      EdgeRuntime.waitUntil(
        fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          console.log('✅ Embeddings iniciados');
          return res;
        }).catch(err => {
          console.error('⚠️ Error iniciando embeddings:', err);
        })
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error crítico en bulk-import:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: 'Error crítico en importación masiva'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
