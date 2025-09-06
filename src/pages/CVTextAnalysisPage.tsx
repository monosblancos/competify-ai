import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '../components/ui/textarea';
import { CVAnalysisResult } from '../types';

const CVTextAnalysisPage: React.FC = () => {
  const [cvText, setCvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLastAnalysis } = useAuth();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      setError('Por favor, ingresa el contenido de tu CV');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch standards for the AI prompt
      const { data: standards, error: standardsError } = await supabase
        .from('standards')
        .select('code, title');

      if (standardsError) throw standardsError;

      // Call the analyze-cv-text edge function
      const { data, error: functionError } = await supabase.functions.invoke('analyze-cv-text', {
        body: { 
          cvText: cvText.trim(),
          standards: standards || []
        }
      });

      if (functionError) throw functionError;

      const analysisResult: CVAnalysisResult = data;

      // Save to user's lastAnalysisResult and redirect
      await setLastAnalysis(analysisResult);
      navigate('/dashboard');

    } catch (e) {
      console.error('Error analyzing CV:', e);
      setError('Hubo un error al analizar el CV. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Análisis de CV
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Pega el contenido de tu CV para recibir un análisis y recomendaciones personalizadas con IA.
          </p>
          
          <div className="flex justify-center">
            <Link 
              to="/analisis-cv" 
              className="btn-secondary flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              ¿Prefieres subir un archivo? Haz clic aquí
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="card-elegant p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Contenido de tu CV
            </h2>
            
            <div className="mb-6">
              <Textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Pega aquí el contenido completo de tu CV. Incluye tu experiencia laboral, educación, habilidades, certificaciones y cualquier otra información relevante..."
                className="min-h-[300px] text-base"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={!cvText.trim() || isLoading}
              className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando con IA...
                </>
              ) : (
                'Analizar con IA'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                La información de tu CV se mantendrá privada y segura. El análisis tardará unos segundos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVTextAnalysisPage;