import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorFallbackProps {
  error?: Error;
  onReset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Algo salió mal
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Ocurrió un error inesperado. Puedes intentar recargar la página.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-6 p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer font-medium mb-2">
              Detalles del error
            </summary>
            <pre className="text-sm text-red-600 overflow-x-auto">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
        
        <Button onClick={handleReset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Recargar página
        </Button>
      </div>
    </div>
  );
};