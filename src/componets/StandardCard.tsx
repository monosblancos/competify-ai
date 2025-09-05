import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Standard } from '../types';

interface StandardCardProps {
  standard: Standard;
}

const StandardCard: React.FC<StandardCardProps> = ({ standard }) => {
  const { isEnrolled, getCertificationProgress } = useAuth();
  
  const enrolled = isEnrolled(standard.code);
  const progress = getCertificationProgress(standard.code);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Educación y Formación':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Evaluación y Certificación':
        return 'bg-success/10 text-success border-success/20';
      case 'Consultoría':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'progress-complete';
    if (progress > 0) return 'progress-partial';
    return 'progress-none';
  };

  return (
    <div className="card-elegant group hover:shadow-glow">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                {standard.code}
              </span>
              {standard.isCoreOffering && (
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                  DESTACADO
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
              {standard.title}
            </h3>
            
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(standard.category)} mb-3`}>
              {standard.category}
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 flex-grow text-sm leading-relaxed">
          {standard.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{standard.modules.length} módulos</span>
            <span>
              {standard.modules.reduce((acc, module) => 
                acc + (module.duration ? parseInt(module.duration) : 2), 0
              )} horas
            </span>
          </div>
          
          {enrolled && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-foreground">Progreso</span>
                <span className="font-semibold text-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Link 
            to={`/estandares/${standard.code}`}
            className="block w-full btn-primary text-center transition-all duration-300 group-hover:scale-105"
          >
            {enrolled ? 'Continuar Curso' : 'Ver Detalles'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StandardCard;