const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for demonstration - in production this would connect to real APIs
const mockMarketData = {
  skillDemand: [
    { skill: 'EC0366 - Desarrollo de Software', demand: 95, growthRate: 23, avgSalary: 45000, openPositions: 1250 },
    { skill: 'EC0217 - Impartición de Cursos', demand: 87, growthRate: 18, avgSalary: 35000, openPositions: 890 },
    { skill: 'EC0301 - Diseño de Cursos', demand: 82, growthRate: 15, avgSalary: 38000, openPositions: 720 },
    { skill: 'EC0049 - Evaluación de Competencias', demand: 78, growthRate: 12, avgSalary: 42000, openPositions: 650 },
    { skill: 'EC0435 - Análisis de Datos', demand: 92, growthRate: 28, avgSalary: 48000, openPositions: 980 },
    { skill: 'EC0076 - Gestión de Proyectos', demand: 85, growthRate: 20, avgSalary: 46000, openPositions: 760 }
  ],
  marketTrends: {
    totalJobPostings: 12850,
    growthLastMonth: 15.2,
    topIndustries: [
      { name: 'Tecnología', percentage: 35, growth: 25 },
      { name: 'Educación', percentage: 22, growth: 18 },
      { name: 'Consultoría', percentage: 18, growth: 15 },
      { name: 'Manufactura', percentage: 15, growth: 12 },
      { name: 'Servicios', percentage: 10, growth: 8 }
    ],
    skillsShortage: [
      { skill: 'Desarrollo de Software', shortage: 68 },
      { skill: 'Análisis de Datos', shortage: 72 },
      { skill: 'Gestión de Proyectos', shortage: 45 },
      { skill: 'Evaluación de Competencias', shortage: 38 }
    ]
  },
  regionalData: {
    'Ciudad de México': { demand: 4200, avgSalary: 48000, growth: 18 },
    'Guadalajara': { demand: 2800, avgSalary: 42000, growth: 22 },
    'Monterrey': { demand: 2400, avgSalary: 45000, growth: 20 },
    'Puebla': { demand: 1200, avgSalary: 38000, growth: 15 },
    'Tijuana': { demand: 980, avgSalary: 40000, growth: 17 }
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, filters } = await req.json();

    console.log('Labor market analysis request:', { type, filters });

    let responseData;

    switch (type) {
      case 'skill-demand':
        responseData = {
          skills: mockMarketData.skillDemand,
          totalSkills: mockMarketData.skillDemand.length,
          lastUpdated: new Date().toISOString()
        };
        break;

      case 'market-trends':
        responseData = {
          trends: mockMarketData.marketTrends,
          lastUpdated: new Date().toISOString()
        };
        break;

      case 'regional-analysis':
        const region = filters?.region || 'all';
        if (region === 'all') {
          responseData = {
            regions: mockMarketData.regionalData,
            totalRegions: Object.keys(mockMarketData.regionalData).length,
            lastUpdated: new Date().toISOString()
          };
        } else {
          responseData = {
            region: region,
            data: mockMarketData.regionalData[region as keyof typeof mockMarketData.regionalData] || null,
            lastUpdated: new Date().toISOString()
          };
        }
        break;

      case 'skill-shortage':
        responseData = {
          shortages: mockMarketData.marketTrends.skillsShortage,
          criticalLevel: 65, // Percentage threshold for critical shortage
          lastUpdated: new Date().toISOString()
        };
        break;

      default:
        // Return complete market overview
        responseData = {
          skillDemand: mockMarketData.skillDemand.slice(0, 5), // Top 5
          marketTrends: mockMarketData.marketTrends,
          topRegions: Object.entries(mockMarketData.regionalData)
            .sort(([,a], [,b]) => b.demand - a.demand)
            .slice(0, 3)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          lastUpdated: new Date().toISOString()
        };
    }

    console.log('Returning market data:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error: unknown) {
    console.error('Error in labor market analysis:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(JSON.stringify({ 
      error: 'Error analyzing labor market: ' + errorMessage,
      details: error instanceof Error ? error.toString() : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});