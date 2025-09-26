import { supabase } from '@/integrations/supabase/client';

export interface SkillDemand {
  skill: string;
  demand: number;
  growthRate: number;
  avgSalary: number;
  openPositions: number;
}

export interface MarketTrends {
  totalJobPostings: number;
  growthLastMonth: number;
  topIndustries: {
    name: string;
    percentage: number;
    growth: number;
  }[];
  skillsShortage: {
    skill: string;
    shortage: number;
  }[];
}

export interface RegionalData {
  [region: string]: {
    demand: number;
    avgSalary: number;
    growth: number;
  };
}

export interface LaborMarketOverview {
  skillDemand: SkillDemand[];
  marketTrends: MarketTrends;
  topRegions: RegionalData;
  lastUpdated: string;
}

export interface SkillDemandResponse {
  skills: SkillDemand[];
  totalSkills: number;
  lastUpdated: string;
}

export interface MarketTrendsResponse {
  trends: MarketTrends;
  lastUpdated: string;
}

export interface RegionalAnalysisResponse {
  regions?: RegionalData;
  region?: string;
  data?: RegionalData[string];
  totalRegions?: number;
  lastUpdated: string;
}

export interface SkillShortageResponse {
  shortages: { skill: string; shortage: number; }[];
  criticalLevel: number;
  lastUpdated: string;
}

export class LaborMarketService {
  static async getMarketOverview(): Promise<LaborMarketOverview> {
    try {
      console.log('Fetching market overview...');

      const { data, error } = await supabase.functions.invoke('labor-market-analysis', {
        body: {
          type: 'overview'
        }
      });

      if (error) {
        console.error('Error calling labor market function:', error);
        throw new Error('Failed to fetch market overview');
      }

      return data as LaborMarketOverview;
    } catch (error) {
      console.error('Error in getMarketOverview:', error);
      throw error;
    }
  }

  static async getSkillDemand(): Promise<SkillDemandResponse> {
    try {
      console.log('Fetching skill demand data...');

      const { data, error } = await supabase.functions.invoke('labor-market-analysis', {
        body: {
          type: 'skill-demand'
        }
      });

      if (error) {
        console.error('Error calling labor market function:', error);
        throw new Error('Failed to fetch skill demand data');
      }

      return data as SkillDemandResponse;
    } catch (error) {
      console.error('Error in getSkillDemand:', error);
      throw error;
    }
  }

  static async getMarketTrends(): Promise<MarketTrendsResponse> {
    try {
      console.log('Fetching market trends...');

      const { data, error } = await supabase.functions.invoke('labor-market-analysis', {
        body: {
          type: 'market-trends'
        }
      });

      if (error) {
        console.error('Error calling labor market function:', error);
        throw new Error('Failed to fetch market trends');
      }

      return data as MarketTrendsResponse;
    } catch (error) {
      console.error('Error in getMarketTrends:', error);
      throw error;
    }
  }

  static async getRegionalAnalysis(region?: string): Promise<RegionalAnalysisResponse> {
    try {
      console.log('Fetching regional analysis for:', region || 'all regions');

      const { data, error } = await supabase.functions.invoke('labor-market-analysis', {
        body: {
          type: 'regional-analysis',
          filters: { region }
        }
      });

      if (error) {
        console.error('Error calling labor market function:', error);
        throw new Error('Failed to fetch regional analysis');
      }

      return data as RegionalAnalysisResponse;
    } catch (error) {
      console.error('Error in getRegionalAnalysis:', error);
      throw error;
    }
  }

  static async getSkillShortage(): Promise<SkillShortageResponse> {
    try {
      console.log('Fetching skill shortage data...');

      const { data, error } = await supabase.functions.invoke('labor-market-analysis', {
        body: {
          type: 'skill-shortage'
        }
      });

      if (error) {
        console.error('Error calling labor market function:', error);
        throw new Error('Failed to fetch skill shortage data');
      }

      return data as SkillShortageResponse;
    } catch (error) {
      console.error('Error in getSkillShortage:', error);
      throw error;
    }
  }
}