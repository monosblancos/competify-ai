import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  AlertTriangle,
  DollarSign,
  Users,
  Briefcase,
  RefreshCw
} from 'lucide-react';
import { LaborMarketService, type LaborMarketOverview } from '@/services/laborMarketService';

export const LaborMarketAnalysis = () => {
  const [marketData, setMarketData] = useState<LaborMarketOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LaborMarketService.getMarketOverview();
      setMarketData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (loading && !marketData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Error al cargar datos del mercado
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchMarketData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Análisis de Mercado Laboral en Tiempo Real
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Datos actualizados sobre demanda de competencias y tendencias del mercado mexicano
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          Última actualización: {new Date(marketData.lastUpdated).toLocaleString('es-MX')}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMarketData}
            disabled={loading}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Vacantes Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatNumber(marketData.marketTrends.totalJobPostings)}
            </div>
            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{marketData.marketTrends.growthLastMonth}% este mes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Crecimiento Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {Math.round(marketData.skillDemand.reduce((acc, skill) => acc + skill.growthRate, 0) / marketData.skillDemand.length)}%
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Demanda de competencias
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Salario Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatSalary(Math.round(marketData.skillDemand.reduce((acc, skill) => acc + skill.avgSalary, 0) / marketData.skillDemand.length))}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Para competencias certificadas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Escasez Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {marketData.marketTrends.skillsShortage.filter(s => s.shortage > 50).length}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Competencias con déficit {'>'} 50%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Skills in Demand */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Competencias Más Demandadas
          </CardTitle>
          <CardDescription>
            Clasificación de estándares CONOCER por demanda y crecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.skillDemand.map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-semibold text-foreground">
                      {skill.skill}
                    </h4>
                    <Badge variant={skill.demand >= 90 ? 'default' : skill.demand >= 80 ? 'secondary' : 'outline'}>
                      {skill.demand}% demanda
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      +{skill.growthRate}% crecimiento
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatSalary(skill.avgSalary)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {formatNumber(skill.openPositions)} vacantes
                    </div>
                  </div>
                </div>
                <div className="w-24">
                  <Progress value={skill.demand} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution and Regional Data */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Industrias con Mayor Demanda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketData.marketTrends.topIndustries.map((industry) => (
                <div key={industry.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{industry.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{industry.percentage}%</span>
                        <Badge variant="outline" className="text-xs">
                          +{industry.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={industry.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Regiones con Mayor Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(marketData.topRegions).map(([region, data]) => (
                <div key={region} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{region}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{formatNumber(data.demand)} vacantes</span>
                      <span>{formatSalary(data.avgSalary)} promedio</span>
                    </div>
                  </div>
                  <Badge variant={data.growth >= 20 ? 'default' : 'secondary'}>
                    +{data.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Shortage Alert */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alerta: Escasez Crítica de Talento
          </CardTitle>
          <CardDescription>
            Competencias con mayor déficit de profesionales certificados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {marketData.marketTrends.skillsShortage.map((shortage) => (
              <div key={shortage.skill} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <span className="font-medium">{shortage.skill}</span>
                <div className="flex items-center gap-2">
                  <Progress value={shortage.shortage} className="w-20 h-2" />
                        <Badge variant="destructive" className="text-xs">
                          {shortage.shortage}% déficit
                        </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};