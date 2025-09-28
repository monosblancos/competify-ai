import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Star, Clock, TrendingUp, ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';

interface GuidedCareerFlowProps {
  onComplete: () => void;
}

type FlowStep = 'analysis' | 'recommendations' | 'selection' | 'enrollment' | 'payment' | 'success';

interface SelectedProduct {
  id: string;
  title: string;
  price_cents: number;
  type: string;
  duration: string;
  standards: string[];
}

const GuidedCareerFlow: React.FC<GuidedCareerFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('analysis');
  const [progress, setProgress] = useState(20);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { lastAnalysis, user } = useAuth();
  const { recommendations, isAnalyzing, analyzeProfile } = usePersonalizedRecommendations();
  const navigate = useNavigate();

  const steps = [
    { id: 'analysis', label: 'Análisis IA', progress: 20 },
    { id: 'recommendations', label: 'Recomendaciones', progress: 40 },
    { id: 'selection', label: 'Selección', progress: 60 },
    { id: 'enrollment', label: 'Inscripción', progress: 80 },
    { id: 'payment', label: 'Pago', progress: 100 }
  ];

  useEffect(() => {
    const currentStepData = steps.find(step => step.id === currentStep);
    if (currentStepData) {
      setProgress(currentStepData.progress);
    }
  }, [currentStep]);

  useEffect(() => {
    // Auto-advance from analysis to recommendations if we have analysis results
    if (currentStep === 'analysis' && lastAnalysis) {
      setTimeout(() => setCurrentStep('recommendations'), 2000);
    }
  }, [currentStep, lastAnalysis]);

  const handleRecommendationSelect = (productId: string) => {
    // In a real app, fetch product details from Supabase
    const mockProduct: SelectedProduct = {
      id: productId,
      title: 'Preparación para Certificación EC0217',
      price_cents: 299900, // $2,999
      type: 'curso',
      duration: '6 semanas',
      standards: ['EC0217']
    };
    setSelectedProduct(mockProduct);
    setCurrentStep('selection');
  };

  const handleEnrollment = () => {
    setCurrentStep('enrollment');
  };

  const handlePayment = async () => {
    if (!selectedProduct || !user) return;
    
    setIsLoading(true);
    
    try {
      // Create checkout session via Supabase edge function
      const { data, error } = await supabase.functions.invoke('create-resource-checkout', {
        body: {
          productId: selectedProduct.id,
          userId: (user as any)?.id || 'anonymous',
          utm: { source: 'guided_flow' }
        }
      });

      if (error) throw error;

      // Redirect to payment or show success
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setCurrentStep('success');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysisStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto">
        <TrendingUp className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Análisis Completado ✨
        </h2>
        <p className="text-muted-foreground">
          Hemos identificado tus fortalezas y las mejores oportunidades para ti
        </p>
      </div>

      {lastAnalysis && (
        <Card className="bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Resumen de tu análisis:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-success font-medium">Fortalezas identificadas:</span>
                <p className="text-muted-foreground">{lastAnalysis.strengths?.length || 0} áreas clave</p>
              </div>
              <div>
                <span className="text-warning font-medium">Oportunidades:</span>
                <p className="text-muted-foreground">{lastAnalysis.opportunities?.length || 0} mejoras potenciales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => setCurrentStep('recommendations')}
          className="btn-hero px-8"
        >
          Ver mis recomendaciones
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderRecommendationsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Recursos Personalizados para Ti
        </h2>
        <p className="text-muted-foreground">
          Basados en tu análisis, estos recursos maximizarán tu desarrollo profesional
        </p>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary">Recomendado</Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(4.9)</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Preparación Certificación EC021{index + 6}
                  </h3>
                  
                  <p className="text-muted-foreground mb-3">
                    Curso completo que te prepara para obtener tu certificación oficial CONOCER con 95% de éxito
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>6 semanas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>+35% salario promedio</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">$2,999</div>
                  <div className="text-sm text-muted-foreground line-through">$3,999</div>
                  <Badge className="bg-success/10 text-success">25% OFF</Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => handleRecommendationSelect(`product-${index}`)}
                className="w-full mt-4 btn-primary"
              >
                Seleccionar este curso
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-2">
          ¡Excelente Elección!
        </h2>
        <p className="text-muted-foreground">
          Has seleccionado el recurso perfecto para tu desarrollo profesional
        </p>
      </div>

      {selectedProduct && (
        <Card className="bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedProduct.title}</span>
              <Badge className="bg-success">Mejor opción para ti</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Duración:</span>
                <p className="font-medium">{selectedProduct.duration}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <p className="font-medium capitalize">{selectedProduct.type}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Estándares:</span>
                <p className="font-medium">{selectedProduct.standards.join(', ')}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Inversión:</span>
                <p className="text-2xl font-bold text-primary">
                  ${(selectedProduct.price_cents / 100).toLocaleString('es-MX')}
                </p>
              </div>
            </div>

            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="font-semibold text-success mb-2">Lo que obtienes:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Acceso de por vida al curso</li>
                <li>✅ Material de estudio actualizado</li>
                <li>✅ Simulacros de evaluación</li>
                <li>✅ Soporte personalizado</li>
                <li>✅ Garantía de satisfacción 30 días</li>
              </ul>
            </div>

            <Button 
              onClick={handleEnrollment}
              className="w-full btn-hero text-lg py-3"
            >
              Continuar con la inscripción
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderEnrollmentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Últimos Detalles
        </h2>
        <p className="text-muted-foreground">
          Confirma tu información y procede al pago seguro
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Resumen de tu compra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedProduct && (
            <>
              <div className="flex justify-between items-center py-2 border-b">
                <span>{selectedProduct.title}</span>
                <span className="font-bold">${(selectedProduct.price_cents / 100).toLocaleString('es-MX')}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span>Descuento por flujo guiado</span>
                <span className="text-success font-bold">-$500</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-lg font-bold">
                <span>Total a pagar:</span>
                <span>${((selectedProduct.price_cents - 50000) / 100).toLocaleString('es-MX')}</span>
              </div>
            </>
          )}

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <span className="font-semibold">Oferta especial</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              El descuento de $500 es válido solo durante este flujo guiado
            </p>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full btn-hero text-lg py-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 w-5 h-5" />
                Proceder al pago seguro
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>🔒 Pago 100% seguro • Garantía 30 días • Acceso inmediato</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-16 h-16 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          ¡Felicidades! 🎉
        </h2>
        <p className="text-muted-foreground">
          Te has inscrito exitosamente. Tu nueva carrera profesional comienza ahora.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Próximos pasos:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </div>
              <span>Recibirás un email con acceso a tu curso en los próximos 5 minutos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </div>
              <span>Accede a tu dashboard personalizado para comenzar</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </div>
              <span>Únete a nuestra comunidad de estudiantes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button 
          onClick={() => navigate('/dashboard')}
          className="btn-hero"
        >
          Ir a mi Dashboard
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/my-courses')}
        >
          Ver mis cursos
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'analysis':
        return renderAnalysisStep();
      case 'recommendations':
        return renderRecommendationsStep();
      case 'selection':
        return renderSelectionStep();
      case 'enrollment':
        return renderEnrollmentStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderAnalysisStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Tu Camino Profesional Guiado
            </h1>
            <p className="text-muted-foreground">
              Te acompañamos paso a paso hacia tu certificación ideal
            </p>
          </div>

          <div className="relative">
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === step.id 
                      ? 'bg-primary text-white' 
                      : progress > step.progress 
                        ? 'bg-success text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {progress > step.progress ? '✓' : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default GuidedCareerFlow;