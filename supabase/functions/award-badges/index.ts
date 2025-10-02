import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BadgeRule {
  badge_id: string;
  check: (userStats: UserStats) => boolean;
}

interface UserStats {
  totalModulesCompleted: number;
  currentStreak: number;
  completedCertifications: number;
  lastActivityDate?: string;
}

// Define badge rules
const BADGE_RULES: BadgeRule[] = [
  {
    badge_id: 'first-module',
    check: (stats) => stats.totalModulesCompleted >= 1,
  },
  {
    badge_id: 'week-streak',
    check: (stats) => stats.currentStreak >= 7,
  },
  {
    badge_id: 'speed-learner',
    check: (stats) => stats.totalModulesCompleted >= 5,
  },
  {
    badge_id: 'first-certification',
    check: (stats) => stats.completedCertifications >= 1,
  },
  {
    badge_id: 'dedication',
    check: (stats) => stats.totalModulesCompleted >= 50,
  },
  {
    badge_id: 'perfectionist',
    check: (stats) => stats.currentStreak >= 30,
  },
  {
    badge_id: 'scholar',
    check: (stats) => stats.completedCertifications >= 5,
  },
  {
    badge_id: 'early-bird',
    check: (stats) => stats.totalModulesCompleted >= 3,
  },
];

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

    // Get user profile and progress
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('progress')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Calculate user stats
    const progress = profile.progress || {};
    const userStats: UserStats = {
      totalModulesCompleted: Object.values(progress).reduce(
        (total: number, standardProgress: any) => 
          total + (standardProgress.completedModules?.length || 0),
        0
      ),
      currentStreak: 0, // TODO: Calculate based on lastActivity dates
      completedCertifications: Object.values(progress).filter(
        (p: any) => (p.completedModules?.length || 0) >= 8
      ).length,
    };

    console.log('User stats:', userStats);

    // Check which badges should be awarded
    const badgesToAward: string[] = [];
    for (const rule of BADGE_RULES) {
      if (rule.check(userStats)) {
        badgesToAward.push(rule.badge_id);
      }
    }

    console.log('Badges to award:', badgesToAward);

    // Get existing user badges (stored in analytics_events for simplicity)
    const { data: existingBadges } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('user_id', user.id)
      .eq('event_name', 'badge_awarded')
      .eq('event_category', 'gamification');

    const awardedBadgeIds = new Set(
      existingBadges?.map((e: any) => e.event_data?.badge_id) || []
    );

    // Award new badges
    const newBadges: string[] = [];
    for (const badgeId of badgesToAward) {
      if (!awardedBadgeIds.has(badgeId)) {
        const { error: insertError } = await supabase
          .from('analytics_events')
          .insert({
            user_id: user.id,
            event_name: 'badge_awarded',
            event_category: 'gamification',
            event_data: { badge_id: badgeId },
            session_id: 'system',
            page_url: '/system/badge-award',
          });

        if (insertError) {
          console.error('Error awarding badge:', insertError);
        } else {
          newBadges.push(badgeId);
          console.log('Awarded badge:', badgeId);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        newBadges,
        totalBadges: badgesToAward.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in award-badges function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
