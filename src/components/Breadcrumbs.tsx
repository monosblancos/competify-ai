import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Inicio',
  'dashboard': 'Panel de Control',
  'analisis-cv': 'Análisis de CV',
  'analisis-cv-texto': 'Análisis de CV por Texto',
  'estandares': 'Estándares de Competencia',
  'mis-cursos': 'Mis Cursos',
  'oportunidades': 'Oportunidades',
  'recursos': 'Recursos',
  'mi-biblioteca': 'Mi Biblioteca',
  'afiliados': 'Programa de Afiliados',
  'comunidad': 'Comunidad',
  'networking': 'Networking',
  'empresas': 'Área Empresarial',
  'diagnostico': 'Diagnóstico',
  'chatbot': 'Asistente Virtual',
  'programas': 'Programas',
  'guided-flow': 'Flujo Guiado',
  'onboarding': 'Bienvenida',
  'login': 'Iniciar Sesión',
  'register': 'Registro'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // No mostrar breadcrumbs en home, login, register
  if (pathnames.length === 0 || ['login', 'register'].includes(pathnames[0])) {
    return null;
  }

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 px-4 py-2 bg-muted/30 rounded-lg"
      aria-label="Breadcrumb"
    >
      <Link 
        to="/" 
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Ir a inicio"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((segment, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[segment] || segment;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {displayName}
              </span>
            ) : (
              <Link 
                to={path}
                className="hover:text-foreground transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
