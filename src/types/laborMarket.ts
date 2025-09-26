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