-- Fix security issue: Prevent public browsing of coupon codes
-- Remove the overly permissive policy that allows reading all active coupons
DROP POLICY IF EXISTS "users_can_validate_specific_coupons" ON public.resource_coupons;

-- Create a secure function to validate specific coupon codes
CREATE OR REPLACE FUNCTION public.validate_coupon_code(coupon_code_input text)
RETURNS TABLE(
  code text,
  discount_pct integer,
  expires_at timestamp with time zone,
  max_uses integer,
  used_count integer,
  active boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return coupon details if the code matches exactly and is valid
  RETURN QUERY
  SELECT 
    c.code,
    c.discount_pct,
    c.expires_at,
    c.max_uses,
    c.used_count,
    c.active
  FROM resource_coupons c
  WHERE c.code = UPPER(coupon_code_input)
    AND c.active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.used_count < c.max_uses);
END;
$$;

-- Create a restricted policy that only allows service role to manage coupons
-- Users will use the validate_coupon_code function instead of direct table access
CREATE POLICY "authenticated_users_can_validate_coupons" ON public.resource_coupons
FOR SELECT
USING (auth.uid() IS NOT NULL AND false); -- This policy intentionally blocks direct access

-- Grant execute permission on the validation function to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_coupon_code TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_coupon_code TO anon;