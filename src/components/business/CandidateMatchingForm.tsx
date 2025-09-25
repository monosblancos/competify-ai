import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, X, Users, Target, Award } from 'lucide-react';
import { standardsData } from '@/data/standardsData';
import { CandidateMatchingService, type MatchingCriteria } from '@/services/candidateMatchingService';

interface CandidateMatchingFormProps {
  onResults: (results: any) => void;
  onLoading: (loading: boolean) => void;
}

export const CandidateMatchingForm = ({ onResults, onLoading }: CandidateMatchingFormProps) => {
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    requiredStandards: [],
    experience: [],
    educationLevel: '',
    objectives: '',
    location: ''
  });

  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  
  const handleSearch = async () => {
    try {
      onLoading(true);
      const results = await CandidateMatchingService.findCandidates(criteria, 20);
      onResults(results);
    } catch (error) {
      console.error('Error searching candidates:', error);
      // You might want to show a toast notification here
    } finally {
      onLoading(false);
    }
  };

  const toggleStandard = (standardCode: string) => {
    const current = criteria.requiredStandards || [];
    const updated = current.includes(standardCode)
      ? current.filter(s => s !== standardCode)
      : [...current, standardCode];
    
    setCriteria({ ...criteria, requiredStandards: updated });
  };

  const toggleExperience = (exp: string) => {
    const updated = selectedExperience.includes(exp)
      ? selectedExperience.filter(e => e !== exp)
      : [...selectedExperience, exp];
    
    setSelectedExperience(updated);
    setCriteria({ ...criteria, experience: updated });
  };

  const removeStandard = (standardCode: string) => {
    const updated = (criteria.requiredStandards || []).filter(s => s !== standardCode);
    setCriteria({ ...criteria, requiredStandards: updated });
  };

  const removeExperience = (exp: string) => {
    const updated = selectedExperience.filter(e => e !== exp);
    setSelectedExperience(updated);
    setCriteria({ ...criteria, experience: updated });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Búsqueda de Candidatos Certificados
        </CardTitle>
        <CardDescription>
          Encuentra profesionales certificados que cumplan con los requisitos de tu empresa
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Required Standards */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificaciones Requeridas
          </Label>
          
          {/* Selected Standards */}
          {criteria.requiredStandards && criteria.requiredStandards.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              {criteria.requiredStandards.map(code => {
                const standard = standardsData.find(s => s.code === code);
                return (
                  <Badge key={code} variant="secondary" className="flex items-center gap-2">
                    {standard?.code}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeStandard(code)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {standardsData.map(standard => (
              <div key={standard.code} className="flex items-start space-x-2">
                <Checkbox
                  id={standard.code}
                  checked={criteria.requiredStandards?.includes(standard.code) || false}
                  onCheckedChange={() => toggleStandard(standard.code)}
                />
                <div className="flex-1">
                  <Label htmlFor={standard.code} className="text-sm font-medium cursor-pointer">
                    {standard.code}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {standard.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Areas */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Áreas de Experiencia
          </Label>
          
          {selectedExperience.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              {selectedExperience.map(exp => (
                <Badge key={exp} variant="outline" className="flex items-center gap-2">
                  {exp}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeExperience(exp)}
                  />
                </Badge>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CandidateMatchingService.getExperienceAreas().map(exp => (
              <div key={exp} className="flex items-center space-x-2">
                <Checkbox
                  id={exp}
                  checked={selectedExperience.includes(exp)}
                  onCheckedChange={() => toggleExperience(exp)}
                />
                <Label htmlFor={exp} className="text-sm cursor-pointer">
                  {exp}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Other Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nivel Educativo Mínimo</Label>
            <Select 
              value={criteria.educationLevel || ''} 
              onValueChange={(value) => setCriteria({ ...criteria, educationLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                {CandidateMatchingService.getEducationLevels().map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ubicación</Label>
            <Input
              placeholder="Ciudad, estado o remoto"
              value={criteria.location || ''}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Objetivos Profesionales (Palabras clave)</Label>
          <Input
            placeholder="e.g., capacitación, desarrollo organizacional, consultoría"
            value={criteria.objectives || ''}
            onChange={(e) => setCriteria({ ...criteria, objectives: e.target.value })}
          />
        </div>

        <Button 
          onClick={handleSearch} 
          className="w-full"
          size="lg"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar Candidatos
        </Button>
      </CardContent>
    </Card>
  );
};
