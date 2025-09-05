import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { JobOpening } from '../types';

interface JobCardProps {
  job: JobOpening;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { getCertificationProgress } = useAuth();

  const calculateCompatibility = () => {
    if (!job.requiredStandards || job.requiredStandards.length === 0) {
      return 100; 
    }
    const totalProgress = job.requiredStandards.reduce((acc, code) => {
      return acc + getCertificationProgress(code);
    }, 0);
    return Math.round(totalProgress / job.requiredStandards.length);
  };

  const compatibility = calculateCompatibility();
  const progressColor = compatibility > 70 ? 'bg-success' : compatibility > 40 ? 'bg-warning' : 'bg-destructive';

  return (
    <div className="card-elegant group hover:shadow-glow">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-card-foreground mb-2">{job.title}</h3>
        <p className="text-muted-foreground mb-4">{job.company} - {job.location}</p>
        <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-foreground">Compatibilidad</span>
            <span className="font-semibold text-foreground">{compatibility}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${compatibility}%` }}></div>
          </div>
        </div>

        {job.requiredStandards.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2 text-sm">Estándares Requeridos:</h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredStandards.map(code => (
                <Link key={code} to={`/estandares/${code}`} 
                      className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                  {code}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-secondary/20 mt-auto">
        <button className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-sm ${
          compatibility < 100 
            ? 'bg-warning text-warning-foreground hover:bg-warning/90' 
            : 'bg-success text-success-foreground hover:bg-success/90'
        }`}>
          {compatibility < 100 ? 'Crear Plan de Estudios' : 'Aplicar (Demo)'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;