import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Award } from 'lucide-react';
import type { BusinessKPIs } from '@/hooks/useAnalyticsDashboard';

interface BusinessKPIsCardProps {
  data: BusinessKPIs;
}

export const BusinessKPIsCard: React.FC<BusinessKPIsCardProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const metrics = [
    {
      label: 'Usuarios Totales',
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      trend: '+12.3%',
      positive: true,
    },
    {
      label: 'Usuarios Activos',
      value: data.activeUsers.toLocaleString(),
      icon: Target,
      trend: '+8.7%',
      positive: true,
    },
    {
      label: 'Tasa de Conversión',
      value: formatPercent(data.conversionRate),
      icon: TrendingUp,
      trend: '+2.1%',
      positive: true,
    },
    {
      label: 'Churn Rate',
      value: formatPercent(data.churnRate),
      icon: TrendingDown,
      trend: '-1.2%',
      positive: true,
    },
    {
      label: 'Ingresos Totales',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      trend: '+24.5%',
      positive: true,
    },
    {
      label: 'Ticket Promedio',
      value: formatCurrency(data.averageOrderValue),
      icon: Award,
      trend: '+5.3%',
      positive: true,
    },
    {
      label: 'CAC',
      value: formatCurrency(data.cac),
      icon: Users,
      trend: '-3.2%',
      positive: true,
    },
    {
      label: 'LTV',
      value: formatCurrency(data.ltv),
      icon: TrendingUp,
      trend: '+18.9%',
      positive: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          KPIs de Negocio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <metric.icon className="h-5 w-5 text-primary" />
                <span
                  className={`text-xs font-medium ${
                    metric.positive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {metric.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
