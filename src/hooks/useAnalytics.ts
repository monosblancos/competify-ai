import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Generate a session ID that persists during the browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export interface AnalyticsEvent {
  event_name: string;
  event_category: 'conversion' | 'engagement' | 'navigation' | 'onboarding' | 'gamification';
  event_data?: Record<string, any>;
  page_url?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  // Track page view on mount
  useEffect(() => {
    trackEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      page_url: window.location.pathname
    });
  }, []);

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_name: event.event_name,
        event_category: event.event_category,
        event_data: event.event_data || {},
        page_url: event.page_url || window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: getSessionId(),
        user_id: user?.email ? undefined : null // Let DB handle auth.uid() for authenticated users
      });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [user]);

  // Conversion funnel tracking
  const trackConversion = useCallback((step: string, data?: Record<string, any>) => {
    trackEvent({
      event_name: `conversion_${step}`,
      event_category: 'conversion',
      event_data: { step, ...data }
    });
  }, [trackEvent]);

  // User journey tracking
  const trackJourneyStep = useCallback((step: string, data?: Record<string, any>) => {
    trackEvent({
      event_name: `journey_${step}`,
      event_category: 'onboarding',
      event_data: { step, ...data }
    });
  }, [trackEvent]);

  // Engagement tracking
  const trackEngagement = useCallback((action: string, data?: Record<string, any>) => {
    trackEvent({
      event_name: `engagement_${action}`,
      event_category: 'engagement',
      event_data: { action, ...data }
    });
  }, [trackEvent]);

  // Gamification tracking
  const trackGamification = useCallback((action: string, data?: Record<string, any>) => {
    trackEvent({
      event_name: `gamification_${action}`,
      event_category: 'gamification',
      event_data: { action, ...data }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackConversion,
    trackJourneyStep,
    trackEngagement,
    trackGamification
  };
};
