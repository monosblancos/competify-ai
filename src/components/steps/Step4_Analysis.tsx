import React, { useState, useEffect } from 'react';
import { ProfileData } from '../ProfileSetupWizard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { analyzeCVForCareerPlan } from '../../services/geminiService';
import { CVAnalysisResult } from '../../types';
import StandardCard from '../../componets/StandardCard';
import { standardsData } from '../../data/standardsData';

interface Step4Props {
  data: ProfileData;
  onPrev: () => void;
  onComplete: () => void;
}

const Step4_Analysis: React.FC<Step4Props> = ({ data, onPrev, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, setLastAnalysis } = useAuth();

  // Convert file to text
  const fileToText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsText(file);
    });
  };

  const saveProfileToDatabase = async (analysis: CVAnalysisResult) => {
    if (!user) return;

    try {
      // Upload CV file to storage if exists
      let cvUrl = null;
      if (data.cvFile) {
        const fileName = `${user.email}/${Date.now()}_${data.cvFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv-uploads')
          .upload(fileName, data.cvFile);

        if (uploadError) {
          console.error('Error uploading CV:', uploadError);
        } else {
          cvUrl = uploadData.path;
        }
      }

      // Save profile data to database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.email, // Use email as the user ID for demo
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          education_level: data.educationLevel,
          experiences: data.experiences as any,
          objectives: data.objectives,
          cv_url: cvUrl,
          last_analysis_result: analysis as any,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error saving profile:', profileError);
      }
    } catch (error) {
      console.error('Error saving profile to database:', error);
    }
  };

  const performAnalysis = async () => {
    if (!data.cvFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert CV file to text
      const cvText = await fileToText(data.cvFile);

      // Prepare enhanced data for analysis
      const enhancedPrompt = {
        cvText,
        experiences: data.experiences,
        objectives: data.objectives,
        fullName: data.fullName,
        educationLevel: data.educationLevel
      };

      // Call Gemini API
      const result = await analyzeCVForCareerPlan(enhancedPrompt);
      
      setAnalysisResult(result);
      await setLastAnalysis(result);
      await saveProfileToDatabase(result);

    } catch (error) {
      console.error('Analysis error:', error);
      setError('Hubo un error al procesar tu análisis. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, []);

  const recommendedStandardDetails = analysisResult 
    ? standardsData.find(s => s.code === analysisResult.recommendedStandard.code) 
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analizando tu perfil con IA
          </h2>
          <p className="text-muted-foreground">
            Nuestro sistema está procesando tu información para crear un análisis personalizado
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Procesando información</h3>
              <p className="text-muted-foreground">Esto puede tomar unos segundos...</p>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-background rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Identificando fortalezas</p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Evaluando oportunidades</p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Generando recomendaciones</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error en el Análisis
          </h2>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={performAnalysis}
            className="btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>

        <div className="flex justify-start">
          <button
            onClick={onPrev}
            className="btn-secondary px-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Tu Análisis Profesional Personalizado
          </h2>
          <p className="text-muted-foreground">
            Basado en tu CV, experiencia y objetivos profesionales
          </p>
        </div>

        <div className="space-y-6">
          {/* Professional Summary */}
          <div className="card-elegant p-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Resumen Profesional
            </h3>
            <p className="text-foreground leading-relaxed">
              ¡Hola {data.fullName}! Basado en tu perfil de {data.educationLevel} y tu experiencia en {data.experiences[0]?.company || 'el sector'}, 
              hemos identificado un gran potencial para tu desarrollo profesional. Tu combinación de habilidades y objetivos te posiciona 
              estratégicamente para avanzar en tu carrera.
            </p>
          </div>

          {/* Strengths */}
          <div className="card-elegant p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Tus Fortalezas Clave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisResult.strengths.map((strength, index) => (
                <div key={index} className="flex items-center p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <span className="text-foreground font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="card-elegant p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Áreas de Oportunidad
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {analysisResult.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full mr-3 mt-2"></div>
                  <span className="text-foreground">{opportunity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Standard */}
          {recommendedStandardDetails && (
            <div className="card-elegant p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Certificación Recomendada
              </h3>
              <p className="text-muted-foreground mb-4">
                Basado en tu perfil y objetivos, esta certificación es la más alineada con tu desarrollo profesional:
              </p>
              <StandardCard standard={recommendedStandardDetails} />
            </div>
          )}

          {/* Next Steps */}
          <div className="card-elegant p-6 bg-gradient-to-br from-accent/5 to-primary/5">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Próximos Pasos Recomendados
            </h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-background/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Explora tu Dashboard Personalizado</p>
                  <p className="text-sm text-muted-foreground">Revisa tu plan de carrera y oportunidades laborales</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-background/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Inicia tu Certificación</p>
                  <p className="text-sm text-muted-foreground">Comienza con el estándar recomendado para maximizar tu impacto</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-background/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Conecta con Oportunidades</p>
                  <p className="text-sm text-muted-foreground">Usa nuestro radar de vacantes para encontrar posiciones relevantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="btn-secondary px-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          
          <button
            onClick={() => window.location.href = '/guided-flow'}
            className="btn-hero px-8"
          >
            Continuar con Recomendaciones
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={onComplete}
            className="btn-secondary px-8"
          >
            Ir a mi Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Step4_Analysis;