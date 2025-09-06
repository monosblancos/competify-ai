import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { CVAnalysisResult } from '../types';
import StandardCard from '../componets/StandardCard';
import { standardsData } from '../data/standardsData';
import { useNavigate } from 'react-router-dom';

const AnalisisCVPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setLastAnalysis } = useAuth();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisResult(null);
      setError(null);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1,
  });
  
  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const fileData = await fileToGenerativePart(file);
      const standards = standardsData.map(s => ({code: s.code, title: s.title}));
      
      const response = await fetch('/functions/v1/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: fileData.inlineData.data,
          mimeType: fileData.inlineData.mimeType,
          standards: standards
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el análisis');
      }

      const parsedResult: CVAnalysisResult = await response.json();

      setAnalysisResult(parsedResult);
      setLastAnalysis(parsedResult);
      navigate('/dashboard');

    } catch (e) {
      console.error(e);
      setError('Hubo un error al analizar el documento. Asegúrate de que el contenido sea claro y legible. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedStandardDetails = analysisResult ? standardsData.find(s => s.code === analysisResult.recommendedStandard.code) : null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Análisis Inteligente de CV
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sube tu CV (PDF o imagen) para recibir un análisis y recomendaciones personalizadas con IA.
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card-elegant p-6">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}>
              <input {...getInputProps()} />
              {file ? (
                <div>
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="max-h-40 mx-auto mb-4 rounded-lg" />
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <p className="text-foreground font-semibold">{file.name}</p>
                  <p className="text-xs text-muted-foreground">Haz clic o arrastra para cambiar el archivo</p>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-foreground font-medium">Arrastra tu archivo aquí, o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground mt-2">PDF o imágenes (JPG, PNG)</p>
                </>
              )}
            </div>
            <button 
              onClick={handleAnalyze} 
              disabled={!file || isLoading} 
              className="mt-6 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          </div>

          {/* Results Section */}
          <div className="card-elegant p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Resultados</h2>
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <p className="text-muted-foreground mt-4">Procesando tu CV, por favor espera...</p>
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive">{error}</p>
              </div>
            )}
            {analysisResult && recommendedStandardDetails && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <svg className="w-5 h-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Fortalezas Clave
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.strengths.map(s => (
                      <span key={s} className="bg-success/10 text-success border border-success/20 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <svg className="w-5 h-5 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Áreas de Oportunidad
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.opportunities.map(o => (
                      <span key={o} className="bg-warning/10 text-warning border border-warning/20 text-xs font-medium px-2.5 py-1 rounded-full">{o}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">🎯 Estándar Recomendado</h3>
                  <StandardCard standard={recommendedStandardDetails} />
                </div>
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-muted-foreground">Sube tu CV para ver tu análisis personalizado aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisCVPage;