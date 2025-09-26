import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ROICalculationRequest {
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  sector: string;
  currentCertifications: string[];
  desiredCertifications: string[];
  investmentBudget?: number;
  employeeCount?: number;
  currentProductivity?: number;
}

interface ROIResult {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { 
      companySize, 
      sector, 
      currentCertifications, 
      desiredCertifications,
      investmentBudget,
      employeeCount = 10,
      currentProductivity = 70
    }: ROICalculationRequest = await req.json();

    // Base costs per certification (in MXN)
    const certificationCosts: Record<string, number> = {
      'EC0076': 8500,
      'EC0217.01': 12000,
      'EC0301': 15000,
      'EC0366': 18000,
      'EC0586': 22000,
    };

    // Base productivity impact per certification
    const productivityImpacts: Record<string, number> = {
      'EC0076': 15, // 15% increase
      'EC0217.01': 25, // 25% increase
      'EC0301': 20, // 20% increase
      'EC0366': 30, // 30% increase
      'EC0586': 35, // 35% increase
    };

    // Sector multipliers
    const sectorMultipliers: Record<string, number> = {
      'Tecnología': 1.4,
      'Educación y Formación': 1.2,
      'Consultoría': 1.3,
      'Manufactura': 1.1,
      'Servicios': 1.0,
      'Salud': 1.2,
      'Finanzas': 1.3,
    };

    // Company size multipliers
    const sizeMultipliers: Record<string, number> = {
      'small': 0.8,
      'medium': 1.0,
      'large': 1.2,
      'enterprise': 1.5,
    };

    const sectorMultiplier = sectorMultipliers[sector] || 1.0;
    const sizeMultiplier = sizeMultipliers[companySize];

    // Calculate costs and impacts for desired certifications
    let totalCertificationCosts = 0;
    let totalProductivityIncrease = 0;
    const certificationBreakdown = [];

    for (const certCode of desiredCertifications) {
      if (!currentCertifications.includes(certCode)) {
        const baseCost = certificationCosts[certCode] || 10000;
        const cost = baseCost * sizeMultiplier;
        const impact = (productivityImpacts[certCode] || 20) * sectorMultiplier;
        
        totalCertificationCosts += cost;
        totalProductivityIncrease += impact;

        certificationBreakdown.push({
          code: certCode,
          title: getCertificationTitle(certCode),
          cost,
          impact,
          timeToComplete: getTimeToComplete(certCode),
        });
      }
    }

    // Calculate training costs (20% of certification costs)
    const trainingCosts = totalCertificationCosts * 0.2;
    const totalInvestment = totalCertificationCosts + trainingCosts;

    // Calculate annual benefits
    const averageSalary = getAverageSalary(sector, companySize);
    const currentAnnualCost = averageSalary * employeeCount;
    const productivityBonus = (totalProductivityIncrease / 100) * currentAnnualCost;
    const annualSavings = productivityBonus * 0.6; // 60% of productivity gains as savings

    // Calculate ROI metrics
    const paybackPeriod = totalInvestment / annualSavings;
    const expectedROI = (annualSavings * 3) - totalInvestment; // 3-year projection
    const roiPercentage = (expectedROI / totalInvestment) * 100;

    const result: ROIResult = {
      totalInvestment,
      expectedROI,
      paybackPeriod,
      productivityIncrease: totalProductivityIncrease,
      annualSavings,
      certificationCosts: totalCertificationCosts,
      trainingCosts,
      certificationBreakdown,
      summary: {
        netBenefit: expectedROI,
        roiPercentage,
        recommendation: generateRecommendation(roiPercentage, paybackPeriod),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating ROI:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error calculating ROI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCertificationTitle(code: string): string {
  const titles: Record<string, string> = {
    'EC0076': 'Evaluación de competencias',
    'EC0217.01': 'Impartición de cursos presenciales',
    'EC0301': 'Diseño de cursos de formación',
    'EC0366': 'Desarrollo de cursos en línea',
    'EC0586': 'Consultoría en general',
  };
  return titles[code] || 'Certificación especializada';
}

function getTimeToComplete(code: string): string {
  const times: Record<string, string> = {
    'EC0076': '2-3 meses',
    'EC0217.01': '1-2 meses',
    'EC0301': '2-4 meses',
    'EC0366': '3-4 meses',
    'EC0586': '4-6 meses',
  };
  return times[code] || '2-3 meses';
}

function getAverageSalary(sector: string, companySize: string): number {
  const baseSalaries: Record<string, number> = {
    'Tecnología': 480000,
    'Educación y Formación': 320000,
    'Consultoría': 420000,
    'Manufactura': 350000,
    'Servicios': 300000,
    'Salud': 380000,
    'Finanzas': 450000,
  };

  const sizeMultipliers: Record<string, number> = {
    'small': 0.8,
    'medium': 1.0,
    'large': 1.2,
    'enterprise': 1.4,
  };

  const baseSalary = baseSalaries[sector] || 350000;
  const multiplier = sizeMultipliers[companySize] || 1.0;
  
  return baseSalary * multiplier;
}

function generateRecommendation(roiPercentage: number, paybackPeriod: number): string {
  if (roiPercentage > 200 && paybackPeriod < 1.5) {
    return 'Excelente inversión: ROI alto con recuperación rápida. Se recomienda proceder inmediatamente.';
  } else if (roiPercentage > 100 && paybackPeriod < 2.5) {
    return 'Buena inversión: ROI positivo con recuperación razonable. Se recomienda la implementación.';
  } else if (roiPercentage > 50 && paybackPeriod < 3) {
    return 'Inversión moderada: Considerar implementación gradual por fases.';
  } else {
    return 'Inversión a evaluar: Revisar estrategia y considerar certificaciones prioritarias.';
  }
}