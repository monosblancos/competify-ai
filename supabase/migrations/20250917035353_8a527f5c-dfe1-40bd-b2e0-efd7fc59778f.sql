-- Secure coupon validation: restrict function execution to authenticated users only
-- Keep existing function signature and body to avoid breaking types

-- Ensure RLS is enabled on coupons (no-op if already enabled)
ALTER TABLE resource_coupons ENABLE ROW LEVEL SECURITY;

-- Remove any public execute privileges on the coupon validation function
REVOKE ALL ON FUNCTION public.validate_coupon_code(text) FROM PUBLIC;

-- Grant execute only to authenticated users and service_role
GRANT EXECUTE ON FUNCTION public.validate_coupon_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_coupon_code(text) TO service_role;

-- Optional hardening: ensure there is no permissive SELECT policy for public
DROP POLICY IF EXISTS "public_can_view_coupons" ON resource_coupons;