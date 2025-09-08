-- Enable RLS on resource_coupons table if not already enabled
ALTER TABLE public.resource_coupons ENABLE ROW LEVEL SECURITY;

-- Allow service role (edge functions) to manage coupons
CREATE POLICY "service_role_can_manage_coupons" 
ON public.resource_coupons 
FOR ALL 
USING (true);

-- Allow authenticated users to validate specific coupons they're trying to use
-- This policy only allows reading a coupon when providing the exact code
-- Users cannot browse all coupons, only check specific ones they know
CREATE POLICY "users_can_validate_specific_coupons" 
ON public.resource_coupons 
FOR SELECT 
TO authenticated
USING (
  -- Only allow access when the coupon is active, not expired, and not at max uses
  active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND (max_uses IS NULL OR used_count < max_uses)
);

-- Completely block anonymous access to coupons table
-- This prevents competitors from browsing available discount codes