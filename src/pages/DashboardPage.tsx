import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { standardsData } from '../data/standardsData';
import StandardCard from '../componets/StandardCard';

const DashboardPage: React.FC = () => {
  const { user, lastAnalysis, progress } = useAuth();

  const enrolledStandards = Object.keys(progress);
  const coreStandards = standardsData.filter(s => s.isCoreOffering);
  const recentlyViewed = coreStandards.slice(0, 3);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Continuemos construyendo tu perfil profesional
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/analisis-cv" className="card-glow p-6 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Analizar CV</h3>
                <p className="text-sm text-muted-foreground">Descubre certificaciones recomendadas</p>
              </div>
            </div>
          </Link>

          <Link to="/estandares" className="card-glow p-6 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Explorar Estándares</h3>
                <p className="text-sm text-muted-foreground">Certificaciones disponibles</p>
              </div>
            </div>
          </Link>

          <Link to="/oportunidades" className="card-glow p-6 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Ver Oportunidades</h3>
                <p className="text-sm text-muted-foreground">Empleos compatibles</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Section */}
        {enrolledStandards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Mi Progreso</h2>
              <Link to="/mis-cursos" className="btn-secondary">Ver Todos</Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledStandards.slice(0, 3).map(code => {
                const standard = standardsData.find(s => s.code === code);
                if (!standard) return null;
                return (
                  <StandardCard key={standard.code} standard={standard} />
                );
              })}
            </div>
          </div>
        )}

        {/* AI Analysis Section */}
        {lastAnalysis && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Último Análisis</h2>
            <div className="card-elegant p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Certificación Recomendada</h3>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary">{lastAnalysis.recommendedStandard.code}</h4>
                  <p className="text-sm text-card-foreground">{lastAnalysis.recommendedStandard.title}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fortalezas Identificadas</h4>
                  <ul className="space-y-1">
                    {lastAnalysis.strengths.slice(0, 3).map((strength, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <svg className="w-4 h-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Áreas de Mejora</h4>
                  <ul className="space-y-1">
                    {lastAnalysis.opportunities.slice(0, 3).map((opportunity, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <svg className="w-4 h-4 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Standards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Certificaciones Destacadas</h2>
            <Link to="/estandares" className="btn-secondary">Ver Todas</Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map(standard => (
              <StandardCard key={standard.code} standard={standard} />
            ))}
          </div>
        </div>

        {/* Get Started CTA */}
        {enrolledStandards.length === 0 && !lastAnalysis && (
          <div className="text-center py-12">
            <div className="card-elegant p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                ¡Comienza tu viaje profesional!
              </h2>
              <p className="text-muted-foreground mb-6">
                Analiza tu CV para recibir recomendaciones personalizadas de certificación
              </p>
              <Link to="/analisis-cv" className="btn-hero">
                Analizar mi CV
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;