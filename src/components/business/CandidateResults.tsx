import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Target, 
  Award, 
  Star,
  MessageCircle,
  Download,
  Eye
} from 'lucide-react';
import type { CandidateProfile, MatchingResponse } from '@/services/candidateMatchingService';

interface CandidateResultsProps {
  results: MatchingResponse;
  loading?: boolean;
}

export const CandidateResults = ({ results, loading }: CandidateResultsProps) => {
  const handleContactCandidate = (candidate: CandidateProfile) => {
    // Here you could open a modal, redirect to a contact form, etc.
    const subject = encodeURIComponent(`Oportunidad Profesional - Certificaciones`);
    const body = encodeURIComponent(
      `Hola ${candidate.fullName},\n\n` +
      `Hemos encontrado tu perfil y creemos que podrías ser un excelente candidato para una oportunidad en nuestra empresa.\n\n` +
      `Nos interesa especialmente tu experiencia en:\n` +
      `${candidate.certifications.map(cert => `• ${cert}`).join('\n')}\n\n` +
      `¿Te interesaría conocer más detalles?\n\n` +
      `Saludos cordiales`
    );
    
    window.open(`mailto:${candidate.email}?subject=${subject}&body=${body}`);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente match';
    if (score >= 60) return 'Buen match';
    return 'Match parcial';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Buscando candidatos...</p>
        </div>
      </div>
    );
  }

  if (!results || results.candidates.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron candidatos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los criterios de búsqueda para encontrar más candidatos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Resultados de la Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{results.candidates.length}</div>
              <div className="text-sm text-muted-foreground">Candidatos encontrados</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.candidates.filter(c => c.matchScore >= 70).length}
              </div>
              <div className="text-sm text-muted-foreground">Matches de alta calidad</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(results.candidates.reduce((acc, c) => acc + c.matchScore, 0) / results.candidates.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Score promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="space-y-4">
        {results.candidates.map((candidate, index) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {candidate.fullName}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {candidate.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {candidate.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                    {candidate.matchScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getMatchScoreLabel(candidate.matchScore)}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Match Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Score de compatibilidad</span>
                  <span className="font-medium">{candidate.matchScore}%</span>
                </div>
                <Progress value={candidate.matchScore} className="h-2" />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-medium">Educación:</span>
                    <span>{candidate.educationLevel}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Target className="h-4 w-4 mt-0.5" />
                    <div>
                      <span className="font-medium">Objetivos:</span>
                      <p className="text-muted-foreground mt-1">{candidate.objectives}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span className="font-medium">Completación:</span>
                    <span>{candidate.completionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {candidate.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificaciones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.certifications.map(cert => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Reasons */}
              {candidate.matchReasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    ¿Por qué es un buen candidato?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {candidate.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleContactCandidate(candidate)}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};