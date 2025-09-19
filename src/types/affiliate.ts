export interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  status: 'pending' | 'active' | 'suspended';
  commission_rate: number;
  total_earnings_cents: number;
  total_referrals: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  referred_user_id?: string;
  order_id?: string;
  referral_code: string;
  commission_cents: number;
  commission_rate: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  created_at: string;
  confirmed_at?: string;
  paid_at?: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method?: string;
  payment_details?: any;
  created_at: string;
  processed_at?: string;
}

export interface AffiliateStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalReferrals: number;
  conversionRate: number;
  clicksThisMonth: number;
  earningsThisMonth: number;
}