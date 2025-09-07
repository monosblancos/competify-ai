import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Step1_BasicInfo from './steps/Step1_BasicInfo';
import Step2_Experience from './steps/Step2_Experience';
import Step3_Objectives from './steps/Step3_Objectives';
import Step4_Analysis from './steps/Step4_Analysis';

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  educationLevel: string;
  cvFile: File | null;
  experiences: Array<{
    title: string;
    company: string;
    description: string;
  }>;
  objectives: string;
}

const ProfileSetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    educationLevel: '',
    cvFile: null,
    experiences: [],
    objectives: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = (stepData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateData = (newData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_BasicInfo
            data={profileData}
            onNext={handleNext}
            updateData={updateData}
          />
        );
      case 2:
        return (
          <Step2_Experience
            data={profileData}
            onNext={handleNext}
            onPrev={handlePrev}
            updateData={updateData}
          />
        );
      case 3:
        return (
          <Step3_Objectives
            data={profileData}
            onNext={handleNext}
            onPrev={handlePrev}
            updateData={updateData}
          />
        );
      case 4:
        return (
          <Step4_Analysis
            data={profileData}
            onPrev={handlePrev}
            onComplete={() => navigate('/dashboard')}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Información Básica';
      case 2: return 'Experiencia Laboral';
      case 3: return 'Objetivos Profesionales';
      case 4: return 'Análisis IA';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Datos personales y CV';
      case 2: return 'Tu trayectoria profesional';
      case 3: return 'Tus metas y aspiraciones';
      case 4: return 'Análisis personalizado con IA';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground text-center mb-8">
              Configuración de tu Perfil Profesional
            </h1>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                      step <= currentStep 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background text-muted-foreground border-muted'
                    }`}>
                      {step < currentStep ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-foreground">{getStepTitle(step)}</div>
                      <div className="text-xs text-muted-foreground">{getStepDescription(step)}</div>
                    </div>
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="card-elegant p-8">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupWizard;