-- Create affiliate system tables
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  affiliate_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  total_earnings_cents INTEGER NOT NULL DEFAULT 0,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID
);

-- Create referral tracking table
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID,
  order_id UUID REFERENCES public.resource_orders(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  commission_cents INTEGER NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Users can view own affiliate profile" 
ON public.affiliates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own affiliate profile" 
ON public.affiliates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate profile" 
ON public.affiliates 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Affiliates can view own referrals" 
ON public.affiliate_referrals 
FOR SELECT 
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Service role can manage referrals" 
ON public.affiliate_referrals 
FOR ALL 
USING (true);

-- RLS Policies for affiliate_payouts
CREATE POLICY "Affiliates can view own payouts" 
ON public.affiliate_payouts 
FOR SELECT 
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- Create function to generate unique affiliate code
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substr(md5(random()::text), 1, 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.affiliates WHERE affiliate_code = code) INTO exists_code;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_code;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update affiliate stats
CREATE OR REPLACE FUNCTION public.update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total earnings and referrals count
  UPDATE public.affiliates 
  SET 
    total_earnings_cents = (
      SELECT COALESCE(SUM(commission_cents), 0) 
      FROM public.affiliate_referrals 
      WHERE affiliate_id = NEW.affiliate_id AND status = 'confirmed'
    ),
    total_referrals = (
      SELECT COUNT(*) 
      FROM public.affiliate_referrals 
      WHERE affiliate_id = NEW.affiliate_id
    )
  WHERE id = NEW.affiliate_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats when referral status changes
CREATE TRIGGER update_affiliate_stats_trigger
AFTER INSERT OR UPDATE ON public.affiliate_referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_affiliate_stats();