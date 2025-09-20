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
    );

    const { referralCode, userId, action } = await req.json();

    if (!referralCode || !userId || !action) {
      throw new Error('Missing required parameters');
    }

    // Find the affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabaseClient
      .from('affiliates')
      .select('id, user_id, commission_rate')
      .eq('affiliate_code', referralCode)
      .eq('status', 'approved')
      .single();

    if (affiliateError || !affiliate) {
      console.log('Affiliate not found or not approved');
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Don't track self-referrals
    if (affiliate.user_id === userId) {
      return new Response(JSON.stringify({ success: false, reason: 'self-referral' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if referral already exists for this user
    const { data: existingReferral } = await supabaseClient
      .from('affiliate_referrals')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('referred_user_id', userId)
      .single();

    if (existingReferral) {
      return new Response(JSON.stringify({ success: false, reason: 'already-tracked' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create the referral record
    const { data: referral, error: referralError } = await supabaseClient
      .from('affiliate_referrals')
      .insert({
        affiliate_id: affiliate.id,
        referred_user_id: userId,
        referral_code: referralCode,
        commission_rate: affiliate.commission_rate,
        status: 'pending'
      })
      .select()
      .single();

    if (referralError) {
      throw referralError;
    }

    return new Response(JSON.stringify({ success: true, referral }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error tracking affiliate referral:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});