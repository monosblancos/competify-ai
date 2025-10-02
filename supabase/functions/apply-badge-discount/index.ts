import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { orderAmount } = await req.json();

    if (!orderAmount || orderAmount <= 0) {
      throw new Error('Invalid order amount');
    }

    // Get user's awarded badges
    const { data: awardedBadges, error: badgesError } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('user_id', user.id)
      .eq('event_name', 'badge_awarded')
      .eq('event_category', 'gamification');

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      throw badgesError;
    }

    const badgeIds = awardedBadges?.map((e: any) => e.event_data?.badge_id) || [];
    console.log('User badges:', badgeIds);

    if (badgeIds.length === 0) {
      return new Response(
        JSON.stringify({
          hasDiscount: false,
          discountPct: 0,
          discountAmount: 0,
          finalAmount: orderAmount,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get badge benefits for user's badges
    const { data: benefits, error: benefitsError } = await supabase
      .from('badge_benefits')
      .select('*')
      .in('badge_id', badgeIds)
      .eq('active', true);

    if (benefitsError) {
      console.error('Error fetching benefits:', benefitsError);
      throw benefitsError;
    }

    // Find the highest discount
    let maxDiscountPct = 0;
    let bestBadgeId = null;

    for (const benefit of benefits || []) {
      if (benefit.discount_pct > maxDiscountPct) {
        maxDiscountPct = benefit.discount_pct;
        bestBadgeId = benefit.badge_id;
      }
    }

    const discountAmount = Math.floor((orderAmount * maxDiscountPct) / 100);
    const finalAmount = orderAmount - discountAmount;

    console.log('Applied discount:', {
      badgeId: bestBadgeId,
      discountPct: maxDiscountPct,
      discountAmount,
      finalAmount,
    });

    // Track discount application
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_name: 'badge_discount_applied',
      event_category: 'conversion',
      event_data: {
        badge_id: bestBadgeId,
        discount_pct: maxDiscountPct,
        discount_amount: discountAmount,
        original_amount: orderAmount,
        final_amount: finalAmount,
      },
      session_id: 'system',
      page_url: '/checkout',
    });

    return new Response(
      JSON.stringify({
        hasDiscount: maxDiscountPct > 0,
        discountPct: maxDiscountPct,
        discountAmount,
        finalAmount,
        badgeId: bestBadgeId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in apply-badge-discount function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
