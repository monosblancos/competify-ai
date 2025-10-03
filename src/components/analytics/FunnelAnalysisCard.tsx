import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FunnelData } from '@/hooks/useAnalyticsDashboard';

interface FunnelAnalysisCardProps {
  data: FunnelData[];
}

export const FunnelAnalysisCard: React.FC<FunnelAnalysisCardProps> = ({ data }) => {
  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--primary-dark))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Análisis de Funnel de Conversión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Funnel Visualization */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="step"
                  stroke="hsl(var(--muted-foreground))"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="users" radius={[0, 8, 8, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Rates */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.map((step, idx) => (
              <div
                key={step.step}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {step.step}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {step.users.toLocaleString()}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: colors[idx % colors.length] }}
                >
                  {step.conversionRate.toFixed(1)}% conversión
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
