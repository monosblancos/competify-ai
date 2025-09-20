import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Star, 
  Award,
  ArrowRight,
  Zap
} from 'lucide-react';
import { PersonalizedRecommendation } from '@/hooks/usePersonalizedRecommendations';

interface PersonalizedRecommendationsDisplayProps {
  recommendations: PersonalizedRecommendation[];
}

export const PersonalizedRecommendationsDisplay: React.FC<PersonalizedRecommendationsDisplayProps> = ({
  recommendations
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Bajo': return 'bg-green-500';
      case 'Medio': return 'bg-yellow-500';
      case 'Alto': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recomendaciones Personalizadas</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Basadas en tu perfil profesional y objetivos específicos
        </p>
      </div>

      {recommendations.map((rec, index) => (
        <Card key={index} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-primary font-mono">{rec.standard.code}</span>
                  <Badge 
                    variant="outline" 
                    className={`${getMatchScoreColor(rec.matchScore)} border-current`}
                  >
                    {rec.matchScore}% match
                  </Badge>
                </CardTitle>
                <p className="text-sm font-medium mt-1">{rec.standard.title}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {rec.standard.category}
                </Badge>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`w-3 h-3 rounded-full ${getDifficultyColor(rec.difficulty)}`} 
                     title={`Dificultad: ${rec.difficulty}`} />
                <span className="text-xs text-muted-foreground">
                  ROI {rec.roi}%
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {rec.standard.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-green-600">{rec.salaryImpact}</span>
                  <p className="text-xs text-muted-foreground">Impacto salarial</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">{rec.timeToComplete}</span>
                  <p className="text-xs text-muted-foreground">Tiempo estimado</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                ¿Por qué es ideal para ti?
              </p>
              <ul className="space-y-1">
                {rec.reasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-muted-foreground">
                  Recomendación #{index + 1}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                  <Award className="h-4 w-4 mr-2" />
                  Certificarme
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">¿Quieres una consultoría 1:1?</p>
              <p className="text-sm text-muted-foreground">
                Obtén un plan personalizado con nuestros expertos
              </p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Agendar Consultoría
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};