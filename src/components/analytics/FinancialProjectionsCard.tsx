import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { FinancialProjection } from '@/hooks/useAnalyticsDashboard';

interface FinancialProjectionsCardProps {
  data: FinancialProjection[];
}

export const FinancialProjectionsCard: React.FC<FinancialProjectionsCardProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
  const avgGrowth = ((data[data.length - 1].revenue / data[0].revenue - 1) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Proyecciones Financieras (12 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="text-sm text-muted-foreground mb-1">
                Ingresos Proyectados
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-xs text-success mt-1">
                +{avgGrowth}% crecimiento promedio
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-success/10 to-success/5">
              <div className="text-sm text-muted-foreground mb-1">
                Utilidad Proyectada
              </div>
              <div className="text-3xl font-bold text-success">
                {formatCurrency(totalProfit)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Margen: {((totalProfit / totalRevenue) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="text-sm text-muted-foreground mb-1">
                Usuarios Proyectados
              </div>
              <div className="text-3xl font-bold text-accent">
                {data[data.length - 1].users.toLocaleString()}
              </div>
              <div className="text-xs text-success mt-1">
                +{(((data[data.length - 1].users / data[0].users - 1) * 100).toFixed(1))}% crecimiento
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorRevenue)"
                  name="Ingresos"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--success))"
                  fill="url(#colorProfit)"
                  name="Utilidad"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  stroke="hsl(var(--destructive))"
                  fill="url(#colorCosts)"
                  name="Costos"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Users Growth Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                  name="Usuarios"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
