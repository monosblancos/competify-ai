import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { standardsData } from '../data/standardsData';
import StandardCard from '../componets/StandardCard';

const MyCoursesPage: React.FC = () => {
  const { progress, getCertificationProgress } = useAuth();

  const enrolledStandards = Object.keys(progress).map(code => {
    const standard = standardsData.find(s => s.code === code);
    const progressPercentage = getCertificationProgress(code);
    return {
      standard,
      progress: progressPercentage
    };
  }).filter(item => item.standard);

  const completedCourses = enrolledStandards.filter(item => item.progress === 100);
  const inProgressCourses = enrolledStandards.filter(item => item.progress > 0 && item.progress < 100);
  const notStartedCourses = enrolledStandards.filter(item => item.progress === 0);

  if (enrolledStandards.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-8">Mis Cursos</h1>
          
          <div className="text-center py-12">
            <div className="card-elegant p-8 max-w-2xl mx-auto">
              <svg className="w-24 h-24 text-muted-foreground mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Aún no tienes cursos
              </h2>
              <p className="text-muted-foreground mb-8">
                Comienza tu viaje de certificación explorando nuestros estándares de competencia
                o analizando tu CV para recibir recomendaciones personalizadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/analisis-cv" className="btn-primary">
                  Analizar mi CV
                </Link>
                <Link to="/estandares" className="btn-secondary">
                  Explorar Estándares
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mis Cursos</h1>
          <p className="text-xl text-muted-foreground">
            Gestiona tu progreso y continúa con tus certificaciones
          </p>
        </div>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card-elegant p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {enrolledStandards.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Inscritos</div>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {inProgressCourses.length}
            </div>
            <div className="text-sm text-muted-foreground">En Progreso</div>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {completedCourses.length}
            </div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="text-3xl font-bold text-muted-foreground mb-2">
              {notStartedCourses.length}
            </div>
            <div className="text-sm text-muted-foreground">Sin Iniciar</div>
          </div>
        </div>

        {/* In Progress Courses */}
        {inProgressCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <svg className="w-6 h-6 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cursos en Progreso ({inProgressCourses.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map(item => (
                <StandardCard key={item.standard!.code} standard={item.standard!} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <svg className="w-6 h-6 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Cursos Completados ({completedCourses.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(item => (
                <div key={item.standard!.code} className="relative">
                  <StandardCard standard={item.standard!} />
                  <div className="absolute top-4 right-4 bg-success text-success-foreground rounded-full p-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Started Courses */}
        {notStartedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <svg className="w-6 h-6 text-muted-foreground mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Listos para Comenzar ({notStartedCourses.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notStartedCourses.map(item => (
                <StandardCard key={item.standard!.code} standard={item.standard!} />
              ))}
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-glow p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Explorar Más Certificaciones
            </h3>
            <p className="text-muted-foreground mb-6">
              Descubre nuevos estándares que pueden complementar tu perfil profesional
            </p>
            <Link to="/estandares" className="btn-primary">
              Ver Catálogo Completo
            </Link>
          </div>

          <div className="card-glow p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Encontrar Oportunidades
            </h3>
            <p className="text-muted-foreground mb-6">
              Busca empleos que requieran las certificaciones que has completado
            </p>
            <Link to="/oportunidades" className="btn-secondary">
              Ver Empleos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;