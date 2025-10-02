import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FunnelStep {
  step: string;
  count: number;
  conversionRate?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { reportType = 'funnel', startDate, endDate } = await req.json();

    let query = supabase
      .from('analytics_events')
      .select('event_name, event_category, event_data, created_at, user_id, session_id');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: events, error: eventsError } = await query;

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    console.log(`Fetched ${events?.length || 0} events`);

    if (reportType === 'funnel') {
      // Conversion funnel analysis
      const funnelSteps = [
        'page_view',
        'register_attempt',
        'register_success',
        'login_success',
        'journey_onboarding_step_1',
        'journey_onboarding_step_2',
        'journey_onboarding_step_3',
        'journey_onboarding_step_4',
        'conversion_cv_analysis_complete',
        'conversion_onboarding_complete',
      ];

      const stepCounts: Record<string, number> = {};
      const uniqueUsers: Record<string, Set<string>> = {};

      for (const step of funnelSteps) {
        stepCounts[step] = 0;
        uniqueUsers[step] = new Set();
      }

      for (const event of events || []) {
        if (funnelSteps.includes(event.event_name)) {
          stepCounts[event.event_name]++;
          if (event.user_id) {
            uniqueUsers[event.event_name].add(event.user_id);
          } else if (event.session_id) {
            uniqueUsers[event.event_name].add(event.session_id);
          }
        }
      }

      const funnel: FunnelStep[] = [];
      let previousCount = 0;

      for (const step of funnelSteps) {
        const count = uniqueUsers[step].size;
        const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 100;
        
        funnel.push({
          step,
          count,
          conversionRate: Number(conversionRate.toFixed(2)),
        });

        if (count > 0) {
          previousCount = count;
        }
      }

      return new Response(
        JSON.stringify({
          reportType: 'funnel',
          funnel,
          totalEvents: events?.length || 0,
          dateRange: { startDate, endDate },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (reportType === 'engagement') {
      // Engagement metrics
      const engagementEvents = events?.filter(
        (e) => e.event_category === 'engagement'
      ) || [];

      const actionCounts: Record<string, number> = {};
      for (const event of engagementEvents) {
        actionCounts[event.event_name] = (actionCounts[event.event_name] || 0) + 1;
      }

      const topActions = Object.entries(actionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }));

      return new Response(
        JSON.stringify({
          reportType: 'engagement',
          topActions,
          totalEngagementEvents: engagementEvents.length,
          dateRange: { startDate, endDate },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (reportType === 'gamification') {
      // Gamification metrics
      const gamificationEvents = events?.filter(
        (e) => e.event_category === 'gamification'
      ) || [];

      const badgesAwarded: Record<string, number> = {};
      for (const event of gamificationEvents) {
        if (event.event_name === 'badge_awarded' && event.event_data?.badge_id) {
          const badgeId = event.event_data.badge_id;
          badgesAwarded[badgeId] = (badgesAwarded[badgeId] || 0) + 1;
        }
      }

      return new Response(
        JSON.stringify({
          reportType: 'gamification',
          badgesAwarded,
          totalBadges: Object.values(badgesAwarded).reduce((a, b) => a + b, 0),
          uniqueUsers: new Set(
            gamificationEvents.map((e) => e.user_id || e.session_id)
          ).size,
          dateRange: { startDate, endDate },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Invalid report type');
  } catch (error) {
    console.error('Error in analytics-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
