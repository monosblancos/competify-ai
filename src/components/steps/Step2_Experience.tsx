import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ProfileData } from '../ProfileSetupWizard';

interface Step2Props {
  data: ProfileData;
  onNext: (stepData: Partial<ProfileData>) => void;
  onPrev: () => void;
  updateData: (newData: Partial<ProfileData>) => void;
}

interface Experience {
  title: string;
  company: string;
  description: string;
}

const Step2_Experience: React.FC<Step2Props> = ({ data, onNext, onPrev, updateData }) => {
  const [experiences, setExperiences] = useState<Experience[]>(
    data.experiences.length > 0 ? data.experiences : [{ title: '', company: '', description: '' }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    updateData({ experiences: updatedExperiences });

    // Clear error when user starts typing
    const errorKey = `${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addExperience = () => {
    const newExperiences = [...experiences, { title: '', company: '', description: '' }];
    setExperiences(newExperiences);
    updateData({ experiences: newExperiences });
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
      updateData({ experiences: newExperiences });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    experiences.forEach((exp, index) => {
      if (!exp.title.trim()) {
        newErrors[`${index}_title`] = 'El puesto es requerido';
      }
      if (!exp.company.trim()) {
        newErrors[`${index}_company`] = 'La empresa es requerida';
      }
      if (!exp.description.trim()) {
        newErrors[`${index}_description`] = 'La descripción es requerida';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext({ experiences });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Experiencia Laboral
        </h2>
        <p className="text-muted-foreground">
          Cuéntanos sobre tu trayectoria profesional para un análisis más preciso
        </p>
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="bg-muted/30 border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Experiencia {index + 1}
              </h3>
              {experiences.length > 1 && (
                <button
                  onClick={() => removeExperience(index)}
                  className="text-destructive hover:text-destructive/80 p-1"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title_${index}`}>Puesto *</Label>
                <Input
                  id={`title_${index}`}
                  value={experience.title}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  placeholder="Ej: Gerente de Proyectos"
                  className={errors[`${index}_title`] ? 'border-destructive' : ''}
                />
                {errors[`${index}_title`] && (
                  <p className="text-sm text-destructive">{errors[`${index}_title`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`company_${index}`}>Empresa *</Label>
                <Input
                  id={`company_${index}`}
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="Ej: Microsoft México"
                  className={errors[`${index}_company`] ? 'border-destructive' : ''}
                />
                {errors[`${index}_company`] && (
                  <p className="text-sm text-destructive">{errors[`${index}_company`]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description_${index}`}>Descripción de Responsabilidades *</Label>
              <Textarea
                id={`description_${index}`}
                value={experience.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                placeholder="Describe tus principales responsabilidades, logros y habilidades desarrolladas en este puesto..."
                className={`min-h-[100px] ${errors[`${index}_description`] ? 'border-destructive' : ''}`}
              />
              {errors[`${index}_description`] && (
                <p className="text-sm text-destructive">{errors[`${index}_description`]}</p>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5 rounded-lg p-4 transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir otra experiencia
        </button>

        {/* Tips Section */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Consejos para una mejor evaluación:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Incluye logros específicos y métricas cuando sea posible</li>
                <li>• Menciona tecnologías, herramientas o metodologías utilizadas</li>
                <li>• Describe el impacto de tu trabajo en la empresa</li>
                <li>• Incluye experiencia en liderazgo o gestión de equipos</li>
              </ul>
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
          Siguiente
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step2_Experience;