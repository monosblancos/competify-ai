import type { CVAnalysisResult, UserProgress } from '../types';

export const createDemoUser = () => {
  return {
    id: 'demo-user',
    email: 'demo@certificaglobal.mx',
    user_metadata: { name: 'Usuario Demo' }
  };
};

export const getDemoAnalysis = (): CVAnalysisResult => {
  return {
    strengths: ['Liderazgo de equipos', 'Gestión de proyectos', 'Comunicación efectiva'],
    opportunities: ['Análisis financiero', 'Certificación en competencias digitales'],
    recommendedStandard: { code: 'EC0301', title: 'Gestión de Proyectos' }
  };
};

export const getDemoProgress = (): UserProgress => {
  return {
    'EC0301': { completedModules: ['modulo1'] },
    'EC0366': { completedModules: [] }
  };
};

export const isDemoUser = (email: string): boolean => {
  return email === 'demo@certificaglobal.mx' || email === 'demo';
};