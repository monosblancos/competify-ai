-- Fix critical security vulnerability: Secure coupon codes table
-- Drop existing problematic policies
DROP POLICY IF EXISTS "authenticated_users_can_validate_coupons" ON resource_coupons;
DROP POLICY IF EXISTS "public_can_view_coupons" ON resource_coupons;

-- Ensure RLS is enabled (this is critical)
ALTER TABLE resource_coupons ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage coupons (for admin operations)
-- This policy should already exist but we ensure it's correct
DROP POLICY IF EXISTS "service_role_can_manage_coupons" ON resource_coupons;
CREATE POLICY "service_role_can_manage_coupons" 
ON resource_coupons 
FOR ALL 
TO service_role
USING (true);

-- NO public access policy - coupons should NEVER be publicly readable
-- Coupon validation should ONLY happen through the secure function

-- Ensure the validate_coupon_code function has proper security
-- Update function to be more secure and only return what's needed
CREATE OR REPLACE FUNCTION public.validate_coupon_code(coupon_code_input text)
RETURNS TABLE(
  code text, 
  discount_pct integer, 
  expires_at timestamp with time zone, 
  max_uses integer, 
  used_count integer, 
  active boolean,
  is_valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log the validation attempt for security monitoring
  INSERT INTO public.resource_offer_interactions (
    action, 
    session_id, 
    coupon_generated,
    created_at
  ) VALUES (
    'coupon_validation_attempt',
    gen_random_uuid()::text,
    UPPER(coupon_code_input),
    now()
  );

  -- Only return coupon details if the code matches exactly and is valid
  RETURN QUERY
  SELECT 
    c.code,
    c.discount_pct,
    c.expires_at,
    c.max_uses,
    c.used_count,
    c.active,
    CASE 
      WHEN c.code IS NOT NULL 
           AND c.active = true 
           AND (c.expires_at IS NULL OR c.expires_at > now())
           AND (c.max_uses IS NULL OR c.used_count < c.max_uses)
      THEN true 
      ELSE false 
    END as is_valid
  FROM resource_coupons c
  WHERE c.code = UPPER(coupon_code_input)
    AND c.active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.used_count < c.max_uses);

  -- If no valid coupon found, still return a row indicating invalid
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      NULL::text as code,
      NULL::integer as discount_pct, 
      NULL::timestamp with time zone as expires_at,
      NULL::integer as max_uses,
      NULL::integer as used_count,
      NULL::boolean as active,
      false as is_valid;
  END IF;
END;
$$;

-- Grant execute permission only to authenticated users
REVOKE ALL ON FUNCTION public.validate_coupon_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon_code(text) TO authenticated;

-- Create a function to safely increment coupon usage (when order is completed)
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_code_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  coupon_record record;
BEGIN
  -- Get and lock the coupon record
  SELECT * INTO coupon_record 
  FROM resource_coupons 
  WHERE code = UPPER(coupon_code_input)
    AND active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR used_count < max_uses)
  FOR UPDATE;
  
  -- If valid coupon found, increment usage
  IF FOUND THEN
    UPDATE resource_coupons 
    SET used_count = used_count + 1
    WHERE code = UPPER(coupon_code_input);
    
    -- Log the usage
    INSERT INTO public.resource_offer_interactions (
      action, 
      session_id, 
      coupon_generated,
      created_at
    ) VALUES (
      'coupon_used',
      gen_random_uuid()::text,
      UPPER(coupon_code_input),
      now()
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Grant execute permission only to service role (for payment processing)
REVOKE ALL ON FUNCTION public.increment_coupon_usage(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_coupon_usage(text) TO service_role;