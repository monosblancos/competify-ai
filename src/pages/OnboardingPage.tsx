import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, FileText, Brain, Target } from 'lucide-react';

interface OnboardingData {
  name: string;
  profession: string;
  experience: string;
  cvText: string;
  analysisResult?: any;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    profession: '',
    experience: '',
    cvText: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setLastAnalysis } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Get standards for AI analysis
      const { data: standards } = await supabase
        .from('standards')
        .select('code, title, description');

      // Call the edge function
      const { data: result, error } = await supabase.functions.invoke('analyze-cv-text', {
        body: {
          cvText: data.cvText,
          standards: standards || []
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        return;
      }

      // Save analysis result
      const analysisResult = typeof result === 'string' ? JSON.parse(result) : result;
      setData(prev => ({ ...prev, analysisResult }));
      await setLastAnalysis(analysisResult);
      handleNext();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const steps = [
    {
      number: 1,
      title: "Información Personal",
      icon: User,
      description: "Cuéntanos sobre ti"
    },
    {
      number: 2,
      title: "Tu CV",
      icon: FileText,
      description: "Comparte tu experiencia"
    },
    {
      number: 3,
      title: "Análisis IA",
      icon: Brain,
      description: "Analizamos tu perfil"
    },
    {
      number: 4,
      title: "Resultados",
      icon: Target,
      description: "Tu plan personalizado"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a tu Plan de Carrera</h1>
          <p className="text-muted-foreground text-lg">
            Te guiaremos paso a paso para crear tu plan personalizado de certificación
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isActive ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground text-center max-w-20">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Información Personal</h2>
                  <p className="text-muted-foreground">
                    Primero, cuéntanos un poco sobre tu perfil profesional
                  </p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profession">Profesión actual</Label>
                    <Input
                      id="profession"
                      value={data.profession}
                      onChange={(e) => updateData('profession', e.target.value)}
                      placeholder="Ej. Desarrollador, Diseñador, Contador..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Años de experiencia</Label>
                    <Input
                      id="experience"
                      value={data.experience}
                      onChange={(e) => updateData('experience', e.target.value)}
                      placeholder="Ej. 5 años"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Tu Currículum</h2>
                  <p className="text-muted-foreground">
                    Pega el contenido de tu CV para que podamos analizarlo
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <Label htmlFor="cvText">Contenido del CV</Label>
                  <Textarea
                    id="cvText"
                    value={data.cvText}
                    onChange={(e) => updateData('cvText', e.target.value)}
                    placeholder="Pega aquí el contenido de tu currículum vitae..."
                    className="min-h-64 mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Incluye tu experiencia laboral, educación, habilidades y logros principales
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Análisis con IA</h2>
                  <p className="text-muted-foreground">
                    Nuestra IA analizará tu perfil para recomendarte el mejor plan de carrera
                  </p>
                </div>
                
                <div className="max-w-md mx-auto text-center">
                  {!data.analysisResult && (
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing || !data.cvText}
                      size="lg"
                      className="w-full"
                    >
                      {isAnalyzing ? 'Analizando...' : 'Analizar mi Perfil'}
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="mt-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Analizando tu experiencia y habilidades...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && data.analysisResult && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">¡Tu Plan Está Listo!</h2>
                  <p className="text-muted-foreground">
                    Basado en tu perfil, hemos creado un plan personalizado para ti
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Recommended Standard */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-primary">Estándar Recomendado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{data.analysisResult.recommendedStandard?.title}</h3>
                        <Badge variant="secondary">{data.analysisResult.recommendedStandard?.code}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">🎯 Tus Fortalezas</h3>
                    <div className="space-y-2">
                      {data.analysisResult.strengths?.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-600">🚀 Áreas de Oportunidad</h3>
                    <div className="space-y-2">
                      {data.analysisResult.opportunities?.map((opportunity: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          {currentStep < 3 && (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!data.name || !data.profession)) ||
                (currentStep === 2 && !data.cvText)
              }
            >
              Siguiente
            </Button>
          )}

          {currentStep === 4 && (
            <Button onClick={handleComplete}>
              Ir al Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;