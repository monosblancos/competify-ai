import React from 'react';
import { Module } from '../types';

interface ModuleListItemProps {
  module: Module;
  status: 'completed' | 'unlocked' | 'locked';
  onToggleComplete: () => void;
}

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module, status, onToggleComplete }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <svg className="w-5 h-5 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'unlocked':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
      case 'locked':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = () => {
    if (module.isPractical) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground">
          Práctico
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
        Teórico
      </span>
    );
  };

  return (
    <div className={`card-elegant p-4 ${status === 'locked' ? 'opacity-60' : ''}`}>
      <div className="flex items-start space-x-4">
        {getStatusIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-card-foreground mb-2">
                {module.title}
              </h4>
              <p className="text-muted-foreground text-sm mb-3">
                {module.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                {module.duration && (
                  <div className="flex items-center text-muted-foreground">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {module.duration}
                  </div>
                )}
                {getStatusBadge()}
              </div>
              
              {module.content && module.content.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {module.content.map((content, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                      >
                        {content.type === 'video' && (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {content.type === 'pdf' && (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {content.type === 'text' && (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        )}
                        {content.title || content.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {status !== 'locked' && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onToggleComplete}
                className={`btn-primary text-sm ${
                  status === 'completed' 
                    ? 'bg-success hover:bg-success/90' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {status === 'completed' ? 'Completado ✓' : 'Marcar como Completado'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleListItem;