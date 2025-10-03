import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BusinessKPIs {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  churnRate: number;
  totalRevenue: number;
  averageOrderValue: number;
  cac: number;
  ltv: number;
}

export interface TalentMetrics {
  totalCertifications: number;
  completionRate: number;
  avgStudyTime: number;
  engagementScore: number;
  standardsInProgress: number;
  certificationsCompleted: number;
}

export interface FunnelData {
  step: string;
  users: number;
  conversionRate: number;
}

export interface FinancialProjection {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
  users: number;
}

export const useAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [businessKPIs, setBusinessKPIs] = useState<BusinessKPIs | null>(null);
  const [talentMetrics, setTalentMetrics] = useState<TalentMetrics | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [financialProjections, setFinancialProjections] = useState<FinancialProjection[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch Business KPIs
      const { data: orders } = await supabase
        .from('resource_orders')
        .select('*')
        .eq('status', 'completed');

      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*');

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount_cents / 100), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate active users (users with activity in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentEvents } = await supabase
        .from('analytics_events')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const activeUserIds = new Set(recentEvents?.map(e => e.user_id).filter(Boolean));
      const activeUsers = activeUserIds.size;

      setBusinessKPIs({
        totalUsers: profiles?.length || 0,
        activeUsers,
        conversionRate: profiles && profiles.length > 0 ? (totalOrders / profiles.length) * 100 : 0,
        churnRate: 5.2, // Mock data - would need historical tracking
        totalRevenue,
        averageOrderValue,
        cac: 45, // Mock - Cost per acquisition
        ltv: 890, // Mock - Lifetime value
      });

      // Fetch Talent Metrics
      const totalCertifications = profiles?.reduce((sum, profile) => {
        const progress = profile.progress as any;
        return sum + (Object.keys(progress || {}).length);
      }, 0) || 0;

      const completedStandards = profiles?.reduce((sum, profile) => {
        const progress = profile.progress as any;
        let completed = 0;
        Object.values(progress || {}).forEach((p: any) => {
          if (p.completedModules?.length > 0) completed++;
        });
        return sum + completed;
      }, 0) || 0;

      setTalentMetrics({
        totalCertifications,
        completionRate: totalCertifications > 0 ? (completedStandards / totalCertifications) * 100 : 0,
        avgStudyTime: 24.5, // Mock - would need tracking
        engagementScore: 78, // Mock - calculated from events
        standardsInProgress: totalCertifications - completedStandards,
        certificationsCompleted: completedStandards,
      });

      // Fetch Funnel Data
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_name, event_category')
        .in('event_category', ['conversion', 'journey']);

      const funnelSteps = [
        { step: 'Visitantes', users: profiles?.length || 0 },
        { step: 'Registro', users: profiles?.length || 0 },
        { step: 'CV Analizado', users: profiles?.filter(p => p.last_analysis_result).length || 0 },
        { step: 'Estándar Iniciado', users: profiles?.filter(p => Object.keys((p.progress as any) || {}).length > 0).length || 0 },
        { step: 'Compra', users: totalOrders },
      ];

      const funnelWithConversion = funnelSteps.map((step, idx) => ({
        ...step,
        conversionRate: idx > 0 ? (step.users / funnelSteps[idx - 1].users) * 100 : 100,
      }));

      setFunnelData(funnelWithConversion);

      // Generate Financial Projections (12 months)
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const projections: FinancialProjection[] = months.map((month, idx) => {
        const growthRate = 1.15; // 15% monthly growth
        const baseRevenue = totalRevenue || 10000;
        const revenue = baseRevenue * Math.pow(growthRate, idx);
        const costs = revenue * 0.4; // 40% costs
        const profit = revenue - costs;
        const users = (profiles?.length || 100) * Math.pow(1.1, idx); // 10% user growth

        return {
          month,
          revenue: Math.round(revenue),
          costs: Math.round(costs),
          profit: Math.round(profit),
          users: Math.round(users),
        };
      });

      setFinancialProjections(projections);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    businessKPIs,
    talentMetrics,
    funnelData,
    financialProjections,
    refresh: fetchAnalytics,
  };
};
