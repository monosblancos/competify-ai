import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, MousePointer } from 'lucide-react';
import { AffiliateStats as Stats } from '@/types/affiliate';

interface AffiliateStatsProps {
  stats: Stats;
  loading?: boolean;
}

const AffiliateStats: React.FC<AffiliateStatsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Ganancias Totales',
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ganancias Pendientes',
      value: formatCurrency(stats.pendingEarnings),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Referidos Totales',
      value: stats.totalReferrals.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tasa de Conversión',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: MousePointer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="card-elegant hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {index === 3 ? 'De tus clicks totales' : 'Este mes: ' + (index === 0 ? formatCurrency(stats.earningsThisMonth) : '+' + stats.clicksThisMonth)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AffiliateStats;