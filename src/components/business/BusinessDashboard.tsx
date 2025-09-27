import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Award, 
  BarChart3, 
  Activity,
  Bell,
  Building2,
  Target,
  Calendar
} from 'lucide-react';
import { LaborMarketService } from '@/services/laborMarketService';
import { CandidateMatchingService } from '@/services/candidateMatchingService';
import type { LaborMarketOverview } from '@/services/laborMarketService';
import type { CandidateProfile } from '@/services/candidateMatchingService';

interface DashboardMetrics {
  availableCandidates: number;
  newCertifications: number;
  marketGrowth: number;
  averageSalary: number;
}

interface SectorComparison {
  sector: string;
  skillDemand: number;
  averageSalary: number;
  growth: number;
  criticalSkills: string[];
}

interface CertificationAlert {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'new_standard' | 'skill_shortage' | 'market_trend';
  date: string;
}

export const BusinessDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [marketData, setMarketData] = useState<LaborMarketOverview | null>(null);
  const [sectorComparison, setSectorComparison] = useState<SectorComparison[]>([]);
  const [alerts, setAlerts] = useState<CertificationAlert[]>([]);
  const [topCandidates, setTopCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch market data
      const marketResponse = await LaborMarketService.getMarketOverview();
      setMarketData(marketResponse);

      // Generate dashboard metrics
      const dashboardMetrics: DashboardMetrics = {
        availableCandidates: 1247,
        newCertifications: 8,
        marketGrowth: 12.5,
        averageSalary: 45000
      };
      setMetrics(dashboardMetrics);

      // Generate sector comparison data
      const sectorData: SectorComparison[] = [
        {
          sector: 'Tecnología',
          skillDemand: 95,
          averageSalary: 65000,
          growth: 18.2,
          criticalSkills: ['Desarrollo de Software', 'Ciberseguridad', 'Análisis de Datos']
        },
        {
          sector: 'Educación',
          skillDemand: 78,
          averageSalary: 35000,
          growth: 8.5,
          criticalSkills: ['Diseño Instruccional', 'Evaluación de Competencias', 'Tutoría Virtual']
        },
        {
          sector: 'Manufactura',
          skillDemand: 82,
          averageSalary: 42000,
          growth: 6.8,
          criticalSkills: ['Lean Manufacturing', 'Control de Calidad', 'Automatización']
        },
        {
          sector: 'Servicios',
          skillDemand: 71,
          averageSalary: 38000,
          growth: 9.2,
          criticalSkills: ['Atención al Cliente', 'Gestión de Procesos', 'Ventas']
        }
      ];
      setSectorComparison(sectorData);

      // Generate certification alerts
      const alertsData: CertificationAlert[] = [
        {
          id: '1',
          title: 'Nuevo Estándar CONOCER Disponible',
          description: 'EC0435 - Desarrollo de aplicaciones móviles ya está disponible para certificación.',
          priority: 'high',
          type: 'new_standard',
          date: '2024-01-15'
        },
        {
          id: '2',
          title: 'Escasez Crítica de Talento',
          description: 'Alta demanda de profesionales certificados en Ciberseguridad en tu sector.',
          priority: 'high',
          type: 'skill_shortage',
          date: '2024-01-14'
        },
        {
          id: '3',
          title: 'Tendencia de Mercado',
          description: 'Incremento del 25% en demanda de competencias digitales este trimestre.',
          priority: 'medium',
          type: 'market_trend',
          date: '2024-01-13'
        }
      ];
      setAlerts(alertsData);

      // Fetch sample candidates
      const candidatesResponse = await CandidateMatchingService.findCandidates({
        requiredStandards: ['EC0366']
      }, 5);
      setTopCandidates(candidatesResponse.candidates);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Empresarial
            </h1>
            <p className="text-lg text-muted-foreground">
              Vista integral de métricas de mercado y talento certificado
            </p>
          </div>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Programar Reunión
          </Button>
        </div>

        {/* Quick Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Candidatos Disponibles
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.availableCandidates.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Profesionales certificados activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Nuevas Certificaciones
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.newCertifications}</div>
                <p className="text-xs text-muted-foreground">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Crecimiento del Mercado
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{metrics.marketGrowth}%</div>
                <p className="text-xs text-muted-foreground">
                  Últimos 3 meses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Salario Promedio
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.averageSalary)}</div>
                <p className="text-xs text-muted-foreground">
                  Profesionales certificados
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="sectors">Comparativo Sectores</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="candidates">Top Candidatos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Market Overview */}
            {marketData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resumen del Mercado Laboral
                  </CardTitle>
                  <CardDescription>
                    Métricas actualizadas del mercado de competencias certificadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {marketData.marketTrends.totalJobPostings.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total de Vacantes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        +{marketData.marketTrends.growthLastMonth}%
                      </div>
                      <p className="text-sm text-muted-foreground">Crecimiento Mensual</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {marketData.marketTrends.skillsShortage.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Competencias Críticas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Skills in Demand */}
            {marketData && (
              <Card>
                <CardHeader>
                  <CardTitle>Competencias Más Demandadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData.skillDemand.slice(0, 5).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{skill.skill}</div>
                          <div className="text-sm text-muted-foreground">
                            {skill.openPositions} vacantes abiertas
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {skill.avgSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            +{skill.growthRate}% crecimiento
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sectors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Comparativo por Sector
                </CardTitle>
                <CardDescription>
                  Análisis de demanda y salarios por sector industrial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectorComparison.map((sector, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{sector.sector}</h3>
                        <Badge variant="outline">
                          {sector.skillDemand}% demanda
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Salario Promedio</div>
                          <div className="text-xl font-bold">
                            {formatCurrency(sector.averageSalary)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Crecimiento</div>
                          <div className="text-xl font-bold text-green-600">
                            +{sector.growth}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Demanda</div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${sector.skillDemand}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Competencias Críticas:</div>
                        <div className="flex flex-wrap gap-2">
                          {sector.criticalSkills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Alertas Inteligentes</h2>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configurar Alertas
                </Button>
              </div>
              
              {alerts.map((alert) => (
                <Alert key={alert.id} className={getPriorityColor(alert.priority)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <Badge variant="outline" className="ml-2">
                      {alert.priority}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    {alert.description}
                  </AlertDescription>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.date).toLocaleDateString('es-MX')}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Candidatos Destacados
                </CardTitle>
                <CardDescription>
                  Profesionales certificados con mayor puntuación de compatibilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {candidate.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{candidate.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {candidate.educationLevel} • {candidate.certifications.length} certificaciones
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">
                          {Math.round(candidate.matchScore)}% compatibilidad
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Ver Perfil
                          </Button>
                          <Button size="sm">
                            Contactar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Ver Todos los Candidatos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};