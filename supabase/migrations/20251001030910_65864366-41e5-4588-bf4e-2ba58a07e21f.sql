-- Create analytics events table for conversion funnel tracking
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  event_name text NOT NULL,
  event_category text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  page_url text,
  referrer text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (tracking)
CREATE POLICY "Anyone can track events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Users can view their own events
CREATE POLICY "Users can view own events"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better query performance
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Create badge benefits table to link badges with rewards
CREATE TABLE public.badge_benefits (
  badge_id text NOT NULL PRIMARY KEY,
  discount_pct integer DEFAULT 0,
  premium_access_days integer DEFAULT 0,
  special_features jsonb DEFAULT '[]'::jsonb,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.badge_benefits ENABLE ROW LEVEL SECURITY;

-- Everyone can view badge benefits
CREATE POLICY "Everyone can view badge benefits"
ON public.badge_benefits
FOR SELECT
USING (active = true);

-- Insert initial badge benefits
INSERT INTO public.badge_benefits (badge_id, discount_pct, premium_access_days, description) VALUES
('first-module', 5, 0, 'Descuento del 5% en tu primera compra'),
('week-streak', 10, 7, 'Descuento del 10% y 7 días de acceso premium'),
('speed-learner', 15, 14, 'Descuento del 15% y 2 semanas de acceso premium'),
('first-certification', 20, 30, 'Descuento del 20% y 1 mes de acceso premium'),
('dedication', 25, 60, 'Descuento del 25% y 2 meses de acceso premium'),
('perfectionist', 30, 90, 'Descuento del 30% y 3 meses de acceso premium'),
('scholar', 40, 180, 'Descuento del 40% y 6 meses de acceso premium VIP'),
('early-bird', 5, 3, 'Descuento del 5% y 3 días de acceso premium');