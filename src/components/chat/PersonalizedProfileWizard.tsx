import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Brain,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { usePersonalizedRecommendations, UserProfile } from '@/hooks/usePersonalizedRecommendations';

interface PersonalizedProfileWizardProps {
  onComplete: (profile: UserProfile, recommendations: any[]) => void;
  onCancel: () => void;
}

export const PersonalizedProfileWizard: React.FC<PersonalizedProfileWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const { analyzeProfile, isAnalyzing } = usePersonalizedRecommendations();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    educationLevel: '',
    experience: [],
    objectives: [],
    currentSector: '',
    desiredSector: '',
    salaryExpectation: '',
    timeAvailable: '',
    preferredLearning: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const educationOptions = [
    'Secundaria',
    'Preparatoria/Bachillerato',
    'Técnico Superior',
    'Licenciatura',
    'Maestría',
    'Doctorado'
  ];

  const sectorOptions = [
    'Tecnología e Informática',
    'Administración y Negocios',
    'Ventas y Marketing',
    'Recursos Humanos',
    'Manufactura y Producción',
    'Salud y Bienestar',
    'Educación y Capacitación',
    'Finanzas y Contabilidad',
    'Construcción y Arquitectura',
    'Logística y Transporte',
    'Otro'
  ];

  const objectiveOptions = [
    'Aumentar mi salario significativamente',
    'Cambiar de sector profesional',
    'Conseguir un ascenso',
    'Validar mi experiencia actual',
    'Emprender mi propio negocio',
    'Actualizar mis competencias',
    'Acceder a mejores oportunidades laborales',
    'Obtener reconocimiento profesional'
  ];

  const experienceOptions = [
    'Menos de 1 año',
    '1-3 años',
    '3-5 años',
    '5-10 años',
    'Más de 10 años'
  ];

  const salaryRanges = [
    'Menos de $15,000 MXN',
    '$15,000 - $25,000 MXN',
    '$25,000 - $35,000 MXN',
    '$35,000 - $50,000 MXN',
    'Más de $50,000 MXN'
  ];

  const timeOptions = [
    'Menos de 1 hora al día',
    '1-2 horas al día',
    '2-4 horas al día',
    'Fines de semana solamente',
    'Tiempo completo'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const recommendations = await analyzeProfile(profile);
      onComplete(profile, recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const handleExperienceChange = (option: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      experience: checked 
        ? [...prev.experience, option]
        : prev.experience.filter(item => item !== option)
    }));
  };

  const handleObjectiveChange = (option: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      objectives: checked 
        ? [...prev.objectives, option]
        : prev.objectives.filter(item => item !== option)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Cuéntanos sobre ti</h3>
              <p className="text-muted-foreground">Tu formación académica nos ayuda a personalizar las recomendaciones</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="education">Nivel educativo más alto completado</Label>
              <RadioGroup
                value={profile.educationLevel}
                onValueChange={(value) => setProfile(prev => ({ ...prev, educationLevel: value }))}
              >
                {educationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Tu experiencia profesional</h3>
              <p className="text-muted-foreground">Selecciona todas las áreas donde tienes experiencia</p>
            </div>
            
            <div className="space-y-4">
              <Label>Años de experiencia laboral (selecciona todas las que apliquen)</Label>
              <div className="grid grid-cols-1 gap-3">
                {experienceOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={profile.experience.includes(option)}
                      onCheckedChange={(checked) => handleExperienceChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="currentSector">Sector actual</Label>
                <RadioGroup
                  value={profile.currentSector}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, currentSector: value }))}
                  className="mt-2"
                >
                  {sectorOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`current-${option}`} />
                      <Label htmlFor={`current-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Tus objetivos profesionales</h3>
              <p className="text-muted-foreground">¿Qué quieres lograr con una certificación?</p>
            </div>
            
            <div className="space-y-4">
              <Label>Selecciona tus objetivos (puedes elegir varios)</Label>
              <div className="grid grid-cols-1 gap-3">
                {objectiveOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={profile.objectives.includes(option)}
                      onCheckedChange={(checked) => handleObjectiveChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="desiredSector">Sector al que quieres migrar (opcional)</Label>
                <RadioGroup
                  value={profile.desiredSector}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, desiredSector: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="same-sector" />
                    <Label htmlFor="same-sector" className="text-sm">Mantenerme en mi sector actual</Label>
                  </div>
                  {sectorOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`desired-${option}`} />
                      <Label htmlFor={`desired-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Expectativas económicas</h3>
              <p className="text-muted-foreground">Esto nos ayuda a calcular el ROI de tu certificación</p>
            </div>
            
            <div className="space-y-4">
              <Label>Rango salarial actual (mensual bruto)</Label>
              <RadioGroup
                value={profile.salaryExpectation}
                onValueChange={(value) => setProfile(prev => ({ ...prev, salaryExpectation: value }))}
              >
                {salaryRanges.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Tiempo disponible</h3>
              <p className="text-muted-foreground">¿Cuánto tiempo puedes dedicar al estudio?</p>
            </div>
            
            <div className="space-y-4">
              <Label>Tiempo que puedes dedicar al estudio</Label>
              <RadioGroup
                value={profile.timeAvailable}
                onValueChange={(value) => setProfile(prev => ({ ...prev, timeAvailable: value }))}
              >
                {timeOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6">
                <Label>Estilo de aprendizaje preferido</Label>
                <RadioGroup
                  value={profile.preferredLearning}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, preferredLearning: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presencial" id="presencial" />
                    <Label htmlFor="presencial">Presencial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en-linea" id="en-linea" />
                    <Label htmlFor="en-linea">En línea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hibrido" id="hibrido" />
                    <Label htmlFor="hibrido">Híbrido</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autodirigido" id="autodirigido" />
                    <Label htmlFor="autodirigido">Autodirigido</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.educationLevel !== '';
      case 2:
        return profile.experience.length > 0 && profile.currentSector !== '';
      case 3:
        return profile.objectives.length > 0;
      case 4:
        return profile.salaryExpectation !== '';
      case 5:
        return profile.timeAvailable !== '' && profile.preferredLearning !== '';
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Análisis de Perfil Personalizado
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            )}
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
          
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={!canProceed() || isAnalyzing}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Recomendaciones
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};