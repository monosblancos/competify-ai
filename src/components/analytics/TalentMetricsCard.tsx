import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Clock, Target, BookOpen, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { TalentMetrics } from '@/hooks/useAnalyticsDashboard';

interface TalentMetricsCardProps {
  data: TalentMetrics;
}

export const TalentMetricsCard: React.FC<TalentMetricsCardProps> = ({ data }) => {
  const metrics = [
    {
      label: 'Certificaciones Totales',
      value: data.totalCertifications.toLocaleString(),
      icon: Award,
      color: 'text-primary',
    },
    {
      label: 'Tasa de Completitud',
      value: `${data.completionRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-success',
      progress: data.completionRate,
    },
    {
      label: 'Tiempo Promedio de Estudio',
      value: `${data.avgStudyTime.toFixed(1)}h`,
      icon: Clock,
      color: 'text-warning',
    },
    {
      label: 'Score de Engagement',
      value: `${data.engagementScore}/100`,
      icon: TrendingUp,
      color: 'text-primary',
      progress: data.engagementScore,
    },
    {
      label: 'Estándares en Progreso',
      value: data.standardsInProgress.toLocaleString(),
      icon: BookOpen,
      color: 'text-accent',
    },
    {
      label: 'Certificaciones Completadas',
      value: data.certificationsCompleted.toLocaleString(),
      icon: Target,
      color: 'text-success',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Métricas de Talento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-5 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-secondary ${metric.color}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              </div>
              {metric.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={metric.progress} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
