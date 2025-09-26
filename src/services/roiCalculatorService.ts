import { supabase } from '@/integrations/supabase/client';

export interface ROICalculationRequest {
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  sector: string;
  currentCertifications: string[];
  desiredCertifications: string[];
  investmentBudget?: number;
  employeeCount?: number;
  currentProductivity?: number;
}

export interface ROIResult {
  totalInvestment: number;
  expectedROI: number;
  paybackPeriod: number;
  productivityIncrease: number;
  annualSavings: number;
  certificationCosts: number;
  trainingCosts: number;
  certificationBreakdown: Array<{
    code: string;
    title: string;
    cost: number;
    impact: number;
    timeToComplete: string;
  }>;
  summary: {
    netBenefit: number;
    roiPercentage: number;
    recommendation: string;
  };
}

export class ROICalculatorService {
  static async calculateROI(request: ROICalculationRequest): Promise<ROIResult> {
    try {
      const { data, error } = await supabase.functions.invoke('roi-calculator', {
        body: request,
      });

      if (error) {
        throw new Error(`ROI calculation failed: ${error.message}`);
      }

      return data as ROIResult;
    } catch (error) {
      console.error('Error calculating ROI:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  static formatPeriod(years: number): string {
    if (years < 1) {
      const months = Math.round(years * 12);
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `${years.toFixed(1)} ${years === 1 ? 'año' : 'años'}`;
  }
}