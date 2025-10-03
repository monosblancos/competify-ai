import React from 'react';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import { BusinessKPIsCard } from '@/components/analytics/BusinessKPIsCard';
import { TalentMetricsCard } from '@/components/analytics/TalentMetricsCard';
import { FunnelAnalysisCard } from '@/components/analytics/FunnelAnalysisCard';
import { FinancialProjectionsCard } from '@/components/analytics/FinancialProjectionsCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AnalyticsDashboardPage: React.FC = () => {
  const { loading, businessKPIs, talentMetrics, funnelData, financialProjections, refresh } = useAnalyticsDashboard();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-primary" />
              Dashboard Estratégico
            </h1>
            <p className="text-muted-foreground mt-2">
              Análisis integral de métricas de negocio, talento y proyecciones financieras
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={refresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            <Button
              variant="default"
              className="gap-2 bg-gradient-primary"
            >
              <Download className="h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Business KPIs */}
        {businessKPIs && <BusinessKPIsCard data={businessKPIs} />}

        {/* Talent Metrics */}
        {talentMetrics && <TalentMetricsCard data={talentMetrics} />}

        {/* Funnel Analysis */}
        {funnelData.length > 0 && <FunnelAnalysisCard data={funnelData} />}

        {/* Financial Projections */}
        {financialProjections.length > 0 && (
          <FinancialProjectionsCard data={financialProjections} />
        )}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              🎯 Recomendación Estratégica
            </h3>
            <p className="text-sm text-muted-foreground">
              Con una tasa de conversión del {businessKPIs?.conversionRate.toFixed(1)}%, 
              enfócate en mejorar la retención post-compra y aumentar el LTV mediante 
              programas de certificación avanzados.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-success/5 to-transparent">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              📈 Oportunidad de Crecimiento
            </h3>
            <p className="text-sm text-muted-foreground">
              El engagement score de {talentMetrics?.engagementScore} sugiere alta 
              participación. Implementa gamificación adicional y badges premium 
              para aumentar completitud.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-warning/5 to-transparent">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              💡 Insight de Talento
            </h3>
            <p className="text-sm text-muted-foreground">
              {talentMetrics?.standardsInProgress} estándares en progreso indican 
              alto interés. Crea rutas de certificación guiadas para incrementar 
              la tasa de completitud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
