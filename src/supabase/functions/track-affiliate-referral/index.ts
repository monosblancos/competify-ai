import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { referralCode, userId, orderId } = await req.json()

    if (!referralCode) {
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Find affiliate by code
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('affiliate_code', referralCode)
      .eq('status', 'active')
      .single()

    if (affiliateError || !affiliate) {
      console.log('Affiliate not found or inactive:', referralCode)
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive referral code' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if referral already exists for this order
    if (orderId) {
      const { data: existingReferral } = await supabase
        .from('affiliate_referrals')
        .select('id')
        .eq('order_id', orderId)
        .single()

      if (existingReferral) {
        return new Response(
          JSON.stringify({ message: 'Referral already tracked for this order' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Calculate commission
    let commissionCents = 0
    if (orderId) {
      const { data: order } = await supabase
        .from('resource_orders')
        .select('amount_cents')
        .eq('id', orderId)
        .single()

      if (order) {
        commissionCents = Math.round((order.amount_cents * affiliate.commission_rate) / 100)
      }
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from('affiliate_referrals')
      .insert([
        {
          affiliate_id: affiliate.id,
          referred_user_id: userId,
          order_id: orderId,
          referral_code: referralCode,
          commission_cents: commissionCents,
          commission_rate: affiliate.commission_rate,
          status: orderId ? 'confirmed' : 'pending'
        }
      ])
      .select()
      .single()

    if (referralError) {
      console.error('Error creating referral:', referralError)
      return new Response(
        JSON.stringify({ error: 'Failed to track referral' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Referral tracked successfully:', referral.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        referralId: referral.id,
        commissionCents 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in track-affiliate-referral function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})