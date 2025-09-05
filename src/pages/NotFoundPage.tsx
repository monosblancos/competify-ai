import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="card-elegant p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Página no encontrada
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/dashboard" 
              className="btn-primary w-full block text-center"
            >
              Ir al Dashboard
            </Link>
            
            <Link 
              to="/" 
              className="btn-secondary w-full block text-center"
            >
              Volver al Inicio
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Necesitas ayuda? Prueba con:
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <Link to="/estandares" className="text-primary hover:text-primary/80 transition-colors">
                Estándares
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/analisis-cv" className="text-primary hover:text-primary/80 transition-colors">
                Análisis CV
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/oportunidades" className="text-primary hover:text-primary/80 transition-colors">
                Oportunidades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;