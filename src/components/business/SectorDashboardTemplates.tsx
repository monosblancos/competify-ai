import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Cpu,
  Factory,
  GraduationCap,
  Heart,
  DollarSign,
  ShoppingCart,
  Plane,
  Briefcase
} from 'lucide-react';
import { CompanyProfile } from './CompanyProfileSetup';

interface SectorTemplateProps {
  profile: CompanyProfile;
}

interface SectorData {
  icon: React.ReactNode;
  primaryKPIs: KPI[];
  criticalAlerts: Alert[];
  marketInsights: MarketInsight[];
  recommendedActions: Action[];
  industryBenchmarks: Benchmark[];
}

interface KPI {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  target?: string;
}

interface Alert {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface MarketInsight {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface Action {
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface Benchmark {
  metric: string;
  yourValue: number;
  industryAvg: number;
  topPerformers: number;
  unit: string;
}

const getSectorData = (industry: string, companySize: string): SectorData => {
  const sectorTemplates: Record<string, SectorData> = {
    tecnologia: {
      icon: <Cpu className="w-6 h-6" />,
      primaryKPIs: [
        { name: 'Desarrolladores Certificados', value: '78%', change: '+12%', trend: 'up', target: '85%' },
        { name: 'Tiempo de Deployment', value: '2.3 días', change: '-0.5 días', trend: 'up' },
        { name: 'Incidentes de Seguridad', value: '3', change: '-2', trend: 'up' },
        { name: 'Satisfacción DevOps', value: '8.2/10', change: '+0.4', trend: 'up' }
      ],
      criticalAlerts: [
        {
          title: 'Brecha en Ciberseguridad',
          description: '45% del equipo no tiene certificación en seguridad actualizada',
          priority: 'high',
          actionable: true
        },
        {
          title: 'Nueva Versión Framework',
          description: 'React 19 disponible - actualización de competencias recomendada',
          priority: 'medium',
          actionable: true
        }
      ],
      marketInsights: [
        {
          title: 'Demanda de IA/ML en aumento',
          description: 'Incremento del 340% en ofertas que requieren competencias en Machine Learning',
          impact: 'positive'
        },
        {
          title: 'Escasez de talento Cloud Native',
          description: 'Solo 23% de desarrolladores tiene experiencia en Kubernetes',
          impact: 'negative'
        }
      ],
      recommendedActions: [
        {
          title: 'Certificar equipo en DevSecOps',
          description: 'Implementar certificaciones de seguridad para todo el equipo de desarrollo',
          effort: 'medium',
          impact: 'high',
          timeframe: '3 meses'
        },
        {
          title: 'Programa de upskilling IA',
          description: 'Capacitar desarrolladores senior en Machine Learning y LLMs',
          effort: 'high',
          impact: 'high',
          timeframe: '6 meses'
        }
      ],
      industryBenchmarks: [
        { metric: 'Tiempo de resolución bugs', yourValue: 2.3, industryAvg: 3.1, topPerformers: 1.8, unit: 'días' },
        { metric: 'Cobertura de tests', yourValue: 78, industryAvg: 65, topPerformers: 90, unit: '%' },
        { metric: 'Disponibilidad sistema', yourValue: 99.2, industryAvg: 98.5, topPerformers: 99.9, unit: '%' }
      ]
    },
    manufactura: {
      icon: <Factory className="w-6 h-6" />,
      primaryKPIs: [
        { name: 'OEE (Efectividad)', value: '78.5%', change: '+3.2%', trend: 'up', target: '85%' },
        { name: 'Defectos por Millón', value: '125', change: '-45', trend: 'up' },
        { name: 'Tiempo de Setup', value: '12 min', change: '-3 min', trend: 'up' },
        { name: 'Certificaciones ISO', value: '92%', change: '+8%', trend: 'up' }
      ],
      criticalAlerts: [
        {
          title: 'Actualización Normas ISO 9001:2025',
          description: 'Nueva versión de ISO 9001 requiere recertificación del personal',
          priority: 'high',
          actionable: true
        },
        {
          title: 'Brecha en Lean Manufacturing',
          description: '30% de supervisores necesita actualización en metodologías Lean',
          priority: 'medium',
          actionable: true
        }
      ],
      marketInsights: [
        {
          title: 'Automatización Industrial 4.0',
          description: 'Incremento del 250% en demanda de técnicos especializados en IoT industrial',
          impact: 'positive'
        },
        {
          title: 'Regulaciones Ambientales',
          description: 'Nuevas normas de sostenibilidad requieren certificaciones especializadas',
          impact: 'neutral'
        }
      ],
      recommendedActions: [
        {
          title: 'Certificar en Industria 4.0',
          description: 'Capacitar técnicos en IoT, sensores y análisis de datos industriales',
          effort: 'high',
          impact: 'high',
          timeframe: '4 meses'
        },
        {
          title: 'Programa Six Sigma',
          description: 'Implementar certificaciones Green Belt para supervisores',
          effort: 'medium',
          impact: 'medium',
          timeframe: '3 meses'
        }
      ],
      industryBenchmarks: [
        { metric: 'Eficiencia Energética', yourValue: 82, industryAvg: 75, topPerformers: 95, unit: '%' },
        { metric: 'Rotación de Personal', yourValue: 12, industryAvg: 18, topPerformers: 8, unit: '%' },
        { metric: 'Tiempo de Entrega', yourValue: 5.2, industryAvg: 7.1, topPerformers: 3.8, unit: 'días' }
      ]
    },
    educacion: {
      icon: <GraduationCap className="w-6 h-6" />,
      primaryKPIs: [
        { name: 'Docentes Certificados', value: '85%', change: '+15%', trend: 'up', target: '95%' },
        { name: 'Satisfacción Estudiantes', value: '4.2/5', change: '+0.3', trend: 'up' },
        { name: 'Tasa de Graduación', value: '92%', change: '+5%', trend: 'up' },
        { name: 'Empleabilidad', value: '88%', change: '+7%', trend: 'up' }
      ],
      criticalAlerts: [
        {
          title: 'Transformación Digital Educativa',
          description: '40% de docentes necesita capacitación en herramientas digitales',
          priority: 'high',
          actionable: true
        },
        {
          title: 'Nuevos Estándares SEP',
          description: 'Actualización de competencias docentes requerida por normatividad',
          priority: 'medium',
          actionable: true
        }
      ],
      marketInsights: [
        {
          title: 'Educación Híbrida en auge',
          description: 'Incremento del 180% en demanda de competencias en educación online',
          impact: 'positive'
        },
        {
          title: 'Enfoque en Soft Skills',
          description: 'Empleadores priorizan habilidades socioemocionales en graduados',
          impact: 'positive'
        }
      ],
      recommendedActions: [
        {
          title: 'Certificar en EdTech',
          description: 'Capacitar docentes en tecnologías educativas y plataformas digitales',
          effort: 'medium',
          impact: 'high',
          timeframe: '3 meses'
        },
        {
          title: 'Programa de Mentoring',
          description: 'Desarrollar competencias de acompañamiento estudiantil',
          effort: 'low',
          impact: 'medium',
          timeframe: '2 meses'
        }
      ],
      industryBenchmarks: [
        { metric: 'Retención Estudiantil', yourValue: 88, industryAvg: 75, topPerformers: 95, unit: '%' },
        { metric: 'NPS Institucional', yourValue: 65, industryAvg: 45, topPerformers: 80, unit: 'puntos' },
        { metric: 'Tiempo de Inserción Laboral', yourValue: 3.2, industryAvg: 5.8, topPerformers: 2.1, unit: 'meses' }
      ]
    },
    salud: {
      icon: <Heart className="w-6 h-6" />,
      primaryKPIs: [
        { name: 'Personal Certificado', value: '94%', change: '+8%', trend: 'up', target: '98%' },
        { name: 'Satisfacción Pacientes', value: '4.6/5', change: '+0.2', trend: 'up' },
        { name: 'Tiempo de Espera', value: '8 min', change: '-2 min', trend: 'up' },
        { name: 'Incidentes de Seguridad', value: '0.02%', change: '-0.01%', trend: 'up' }
      ],
      criticalAlerts: [
        {
          title: 'Actualización Protocolos COVID',
          description: 'Nuevos protocolos de bioseguridad requieren recertificación',
          priority: 'high',
          actionable: true
        },
        {
          title: 'Telemedicina en expansión',
          description: '60% del personal necesita capacitación en atención virtual',
          priority: 'medium',
          actionable: true
        }
      ],
      marketInsights: [
        {
          title: 'Crecimiento en Telesalud',
          description: 'Incremento del 400% en consultas virtuales post-pandemia',
          impact: 'positive'
        },
        {
          title: 'Especialización Geronto',
          description: 'Alta demanda de especialistas en cuidado del adulto mayor',
          impact: 'positive'
        }
      ],
      recommendedActions: [
        {
          title: 'Certificar en Telemedicina',
          description: 'Capacitar personal médico en tecnologías de salud digital',
          effort: 'medium',
          impact: 'high',
          timeframe: '2 meses'
        },
        {
          title: 'Bioseguridad Avanzada',
          description: 'Actualizar protocolos y certificaciones de seguridad hospitalaria',
          effort: 'low',
          impact: 'high',
          timeframe: '1 mes'
        }
      ],
      industryBenchmarks: [
        { metric: 'Mortalidad Hospitalaria', yourValue: 1.2, industryAvg: 2.1, topPerformers: 0.8, unit: '%' },
        { metric: 'Tiempo de Diagnóstico', yourValue: 24, industryAvg: 36, topPerformers: 18, unit: 'horas' },
        { metric: 'Satisfacción Personal', yourValue: 78, industryAvg: 65, topPerformers: 90, unit: '%' }
      ]
    }
  };

  return sectorTemplates[industry] || sectorTemplates.tecnologia;
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case 'low': return 'text-green-600 bg-green-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'high': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'low': return 'text-gray-600 bg-gray-50';
    case 'medium': return 'text-blue-600 bg-blue-50';
    case 'high': return 'text-purple-600 bg-purple-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    case 'stable': return <Activity className="w-4 h-4 text-yellow-500" />;
  }
};

export const SectorDashboardTemplate: React.FC<SectorTemplateProps> = ({ profile }) => {
  const sectorData = getSectorData(profile.industry, profile.companySize);

  return (
    <div className="space-y-8">
      {/* Header with Industry Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {sectorData.icon}
            Dashboard {profile.industry.charAt(0).toUpperCase() + profile.industry.slice(1)}
            <Badge variant="outline">{profile.companySize}</Badge>
          </CardTitle>
          <CardDescription>
            Métricas y recomendaciones personalizadas para {profile.companyName}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sectorData.primaryKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              {getTrendIcon(kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{kpi.change} vs mes anterior</span>
                {kpi.target && (
                  <Badge variant="outline" className="text-xs">
                    Meta: {kpi.target}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas Críticas del Sector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectorData.criticalAlerts.map((alert, index) => (
            <Alert key={index} className={`${
              alert.priority === 'high' ? 'border-red-200 bg-red-50' : 
              alert.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
              'border-blue-200 bg-blue-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                {alert.title}
                <div className="flex gap-2">
                  <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                    {alert.priority}
                  </Badge>
                  {alert.actionable && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Accionable
                    </Badge>
                  )}
                </div>
              </AlertTitle>
              <AlertDescription className="mt-2">
                {alert.description}
              </AlertDescription>
              {alert.actionable && (
                <div className="mt-3">
                  <Button size="sm" variant="outline">
                    Ver Plan de Acción
                  </Button>
                </div>
              )}
            </Alert>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Insights del Mercado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorData.marketInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant={
                    insight.impact === 'positive' ? 'default' : 
                    insight.impact === 'negative' ? 'destructive' : 
                    'secondary'
                  }>
                    {insight.impact === 'positive' ? 'Oportunidad' : 
                     insight.impact === 'negative' ? 'Riesgo' : 'Neutral'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Acciones Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorData.recommendedActions.map((action, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{action.title}</h4>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getEffortColor(action.effort)}`}>
                      Esfuerzo: {action.effort}
                    </Badge>
                    <Badge className={`text-xs ${getImpactColor(action.impact)}`}>
                      Impacto: {action.impact}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Plazo estimado: {action.timeframe}
                  </span>
                  <Button size="sm" variant="outline">
                    Iniciar Plan
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Benchmarks de la Industria
          </CardTitle>
          <CardDescription>
            Compara tu rendimiento con el promedio del sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sectorData.industryBenchmarks.map((benchmark, index) => {
              const yourProgress = (benchmark.yourValue / benchmark.topPerformers) * 100;
              const avgProgress = (benchmark.industryAvg / benchmark.topPerformers) * 100;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{benchmark.metric}</h4>
                    <div className="flex gap-4 text-sm">
                      <span className="text-primary font-medium">
                        Tu valor: {benchmark.yourValue}{benchmark.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Promedio: {benchmark.industryAvg}{benchmark.unit}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-20">Tu empresa</span>
                      <div className="flex-1 relative">
                        <Progress value={yourProgress} className="h-2" />
                      </div>
                      <span className="text-xs w-12 text-right">{yourProgress.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-20 text-muted-foreground">Promedio</span>
                      <div className="flex-1 relative">
                        <Progress value={avgProgress} className="h-2 opacity-50" />
                      </div>
                      <span className="text-xs w-12 text-right text-muted-foreground">
                        {avgProgress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};