import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { standardsData } from '../data/standardsData';
import { CVAnalysisResult } from '../types';

const AnalisisCVPage: React.FC = () => {
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setLastAnalysis, lastAnalysis } = useAuth();

  const handleAnalyze = async () => {
    if (!cvText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: CVAnalysisResult = {
      strengths: [
        'Experiencia sólida en capacitación empresarial',
        'Conocimientos en desarrollo de contenidos educativos',
        'Habilidades de comunicación efectiva',
        'Experiencia en evaluación de aprendizaje',
        'Manejo de tecnologías educativas'
      ],
      opportunities: [
        'Certificación formal en diseño instruccional',
        'Competencias en evaluación por estándares',
        'Metodologías de capacitación presencial',
        'Técnicas avanzadas de facilitación'
      ],
      recommendedStandard: {
        code: 'EC0217.01',
        title: 'Impartición de cursos de formación del capital humano de manera presencial grupal'
      }
    };
    
    setLastAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCvText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Análisis Inteligente de CV
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nuestro AI analiza tu curriculum vitae para identificar fortalezas, 
            oportunidades de mejora y recomendar certificaciones específicas
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!lastAnalysis ? (
            <div className="card-elegant p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Ingresa tu CV para análisis
              </h2>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cargar archivo (opcional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="btn-secondary cursor-pointer">
                      Seleccionar archivo .txt
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sube un archivo de texto con tu CV
                    </p>
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <label htmlFor="cv-text" className="block text-sm font-medium text-foreground mb-2">
                    O pega tu CV aquí
                  </label>
                  <textarea
                    id="cv-text"
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground 
                             placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary 
                             focus:border-transparent transition-all resize-none"
                    placeholder="Pega aquí el contenido de tu curriculum vitae...

Incluye información como:
• Experiencia laboral
• Educación y certificaciones
• Habilidades técnicas
• Logros profesionales
• Responsabilidades en trabajos anteriores"
                  />
                </div>

                {/* Demo Suggestion */}
                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-accent-foreground mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-accent-foreground">Sugerencia para Demo</h4>
                      <p className="text-sm text-accent-foreground mt-1">
                        Puedes probar con cualquier texto que describa experiencia profesional. 
                        El análisis demostrará las capacidades de nuestra IA.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!cvText.trim() || isAnalyzing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analizando con IA...
                    </>
                  ) : (
                    'Analizar CV'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Analysis Results */}
              <div className="card-elegant p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Resultados del Análisis
                  </h2>
                  <button
                    onClick={() => setLastAnalysis(null)}
                    className="btn-secondary text-sm"
                  >
                    Nuevo Análisis
                  </button>
                </div>

                {/* Recommended Standard */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    🎯 Certificación Recomendada
                  </h3>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-primary mb-2">
                          {lastAnalysis.recommendedStandard.code}
                        </h4>
                        <p className="text-foreground mb-4">
                          {lastAnalysis.recommendedStandard.title}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {standardsData.find(s => s.code === lastAnalysis.recommendedStandard.code)?.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <a 
                        href={`/estandares/${lastAnalysis.recommendedStandard.code}`}
                        className="btn-primary"
                      >
                        Ver Detalles
                      </a>
                      <a 
                        href="/estandares"
                        className="btn-secondary"
                      >
                        Explorar Más
                      </a>
                    </div>
                  </div>
                </div>

                {/* Strengths and Opportunities */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <svg className="w-5 h-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Fortalezas Identificadas
                    </h3>
                    <div className="space-y-3">
                      {lastAnalysis.strengths.map((strength, index) => (
                        <div key={index} className="bg-success/5 border border-success/20 rounded-lg p-4">
                          <p className="text-foreground text-sm">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <svg className="w-5 h-5 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Oportunidades de Mejora
                    </h3>
                    <div className="space-y-3">
                      {lastAnalysis.opportunities.map((opportunity, index) => (
                        <div key={index} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                          <p className="text-foreground text-sm">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  🚀 Próximos Pasos Recomendados
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <a href={`/estandares/${lastAnalysis.recommendedStandard.code}`} className="card-glow p-4 group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary">
                      1. Revisar Estándar
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Conoce en detalle el estándar recomendado
                    </p>
                  </a>
                  <a href="/estandares" className="card-glow p-4 group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary">
                      2. Explorar Opciones
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Descubre otros estándares disponibles
                    </p>
                  </a>
                  <a href="/oportunidades" className="card-glow p-4 group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary">
                      3. Ver Empleos
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Encuentra oportunidades que requieren estas certificaciones
                    </p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalisisCVPage;