import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ProfileData } from '../ProfileSetupWizard';

interface Step3Props {
  data: ProfileData;
  onNext: (stepData: Partial<ProfileData>) => void;
  onPrev: () => void;
  updateData: (newData: Partial<ProfileData>) => void;
}

const Step3_Objectives: React.FC<Step3Props> = ({ data, onNext, onPrev, updateData }) => {
  const [objectives, setObjectives] = useState(data.objectives);
  const [error, setError] = useState('');

  const handleObjectivesChange = (value: string) => {
    setObjectives(value);
    updateData({ objectives: value });
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!objectives.trim()) {
      setError('Por favor, describe tus objetivos profesionales');
      return false;
    }
    
    if (objectives.trim().length < 50) {
      setError('Por favor, proporciona una descripción más detallada (mínimo 50 caracteres)');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext({ objectives });
    }
  };

  const suggestedPrompts = [
    "Quiero obtener un ascenso a una posición gerencial en los próximos 2 años",
    "Mi objetivo es especializarme en transformación digital y liderar proyectos de innovación",
    "Busco certificarme en competencias de liderazgo para dirigir equipos de alto rendimiento",
    "Deseo desarrollar habilidades en análisis de datos para tomar mejores decisiones estratégicas"
  ];

  const addSuggestedPrompt = (prompt: string) => {
    const currentText = objectives.trim();
    const newText = currentText ? `${currentText}\n\n${prompt}` : prompt;
    handleObjectivesChange(newText);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Objetivos Profesionales
        </h2>
        <p className="text-muted-foreground">
          Comparte tus metas y aspiraciones para recibir recomendaciones alineadas con tus objetivos
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="objectives">¿Cuáles son tus objetivos profesionales? *</Label>
          <Textarea
            id="objectives"
            value={objectives}
            onChange={(e) => handleObjectivesChange(e.target.value)}
            placeholder="Describe tus metas profesionales, donde te ves en el futuro, qué habilidades quisieras desarrollar, qué tipo de roles te interesan, etc. Sé específico sobre tus aspiraciones..."
            className={`min-h-[200px] ${error ? 'border-destructive' : ''}`}
          />
          <div className="flex justify-between items-center">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground ml-auto">
              {objectives.length} caracteres (mínimo 50)
            </p>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Ejemplos de objetivos profesionales
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Haz clic en cualquier ejemplo para agregarlo a tu descripción:
          </p>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => addSuggestedPrompt(prompt)}
                className="text-left w-full p-3 text-sm text-foreground bg-background hover:bg-muted border border-border rounded-md transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Para obtener mejores recomendaciones, incluye:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Timeframe específico (ej: "en los próximos 2 años")</li>
                <li>• Industrias o áreas de interés</li>
                <li>• Nivel de responsabilidad deseado</li>
                <li>• Habilidades que quieres desarrollar</li>
                <li>• Tipo de organización donde te gustaría trabajar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vision Board */}
        <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/20 rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Tu Visión Profesional
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Basado en tus objetivos, nuestro análisis de IA te ayudará a:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-foreground">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              Identificar certificaciones relevantes
            </div>
            <div className="flex items-center text-sm text-foreground">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              Crear un plan de carrera personalizado
            </div>
            <div className="flex items-center text-sm text-foreground">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              Encontrar oportunidades laborales afines
            </div>
            <div className="flex items-center text-sm text-foreground">
              <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
              Desarrollar habilidades estratégicas
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
          onClick={handleNext}
          className="btn-primary px-8"
        >
          Analizar con IA
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step3_Objectives;