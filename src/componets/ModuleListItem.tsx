import React, { useState } from 'react';
import { Module, ModuleContent } from '../types';

interface ModuleListItemProps {
  module: Module;
  status: 'completed' | 'unlocked' | 'locked';
  onToggleComplete: () => void;
}

const ModuleContentDisplay: React.FC<{ content: ModuleContent }> = ({ content }) => {
  switch (content.type) {
    case 'video':
      return (
        <div className="aspect-w-16 aspect-h-9 my-4">
          <iframe 
            src={content.url} 
            title={content.title || 'Video'} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            className="w-full h-full rounded-md"
          />
        </div>
      );
    case 'pdf':
      return (
        <div className="my-4">
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            {content.title || 'Descargar Material (PDF)'}
          </a>
        </div>
      );
    case 'text':
      return <p className="text-muted-foreground my-4">{content.text}</p>;
    default:
      return null;
  }
};

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module, status, onToggleComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    <div className={`card-elegant ${status === 'locked' ? 'opacity-60' : ''}`}>
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => status !== 'locked' && setIsExpanded(!isExpanded)}
      >
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
              
              {status !== 'locked' && module.content && module.content.length > 0 && (
                <div className="ml-4">
                  <svg 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
            
            {status !== 'locked' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete();
                  }}
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
      
      {/* Expanded Content */}
      {isExpanded && status !== 'locked' && module.content && (
        <div className="px-6 pb-4 ml-10 border-l-2 border-border">
          {module.content.map((contentItem, index) => (
            <ModuleContentDisplay key={index} content={contentItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleListItem;