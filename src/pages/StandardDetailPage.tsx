import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { standardsData } from '../data/standardsData';
import ModuleListItem from '../componets/ModuleListItem';

const StandardDetailPage: React.FC = () => {
  const { standardCode } = useParams<{ standardCode: string }>();
  const { 
    isEnrolled, 
    startCertification, 
    toggleModuleCompletion, 
    getModuleStatus, 
    getCertificationProgress 
  } = useAuth();

  const standard = standardsData.find(s => s.code === standardCode);

  if (!standard) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Estándar no encontrado
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              El estándar {standardCode} no existe en nuestro catálogo
            </p>
            <Link to="/estandares" className="btn-primary">
              Ver Todos los Estándares
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const enrolled = isEnrolled(standard.code);
  const progress = getCertificationProgress(standard.code);
  const totalDuration = standard.modules.reduce((acc, module) => 
    acc + (module.duration ? parseInt(module.duration) : 2), 0
  );

  const handleEnroll = () => {
    startCertification(standard.code);
  };

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/estandares" className="text-muted-foreground hover:text-primary transition-colors">
                  Estándares
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-foreground font-medium">{standard.code}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="card-elegant p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-lg font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                      {standard.code}
                    </span>
                    {standard.isCoreOffering && (
                      <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                        DESTACADO
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {standard.title}
                  </h1>
                  
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(standard.category)} mb-4`}>
                    {standard.category}
                  </div>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {standard.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {enrolled && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">Progreso del curso</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  {progress === 100 && (
                    <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-success text-sm font-medium">
                        🎉 ¡Felicitaciones! Has completado todos los módulos de este estándar.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{standard.modules.length}</div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{totalDuration}h</div>
                  <div className="text-sm text-muted-foreground">Duración</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {standard.modules.filter(m => m.isPractical).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Prácticos</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {standard.modules.filter(m => !m.isPractical).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Teóricos</div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Módulos del Curso</h2>
                {!enrolled && (
                  <button
                    onClick={handleEnroll}
                    className="btn-primary"
                  >
                    Iniciar Certificación
                  </button>
                )}
              </div>
              
              {standard.modules.map((module, index) => {
                const status = getModuleStatus(standard.code, module.id, index);
                return (
                  <ModuleListItem
                    key={module.id}
                    module={module}
                    status={status}
                    onToggleComplete={() => toggleModuleCompletion(standard.code, module.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="card-elegant p-6">
              {!enrolled ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Comenzar Certificación
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Inicia tu proceso de certificación en este estándar de competencia
                  </p>
                  <button
                    onClick={handleEnroll}
                    className="w-full btn-primary mb-3"
                  >
                    Iniciar Ahora
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Gratis • Sin compromiso • Progreso guardado
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Estás Inscrito
                  </h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">{progress}%</div>
                    <div className="text-sm text-muted-foreground">Completado</div>
                  </div>
                  <Link to="/mis-cursos" className="w-full btn-secondary block text-center">
                    Ver Mis Cursos
                  </Link>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="card-elegant p-6">
              <h3 className="font-semibold text-foreground mb-4">Información del Curso</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <span className="text-foreground">Autoaprendizaje</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Certificación:</span>
                  <span className="text-foreground">CONOCER</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Validez:</span>
                  <span className="text-foreground">5 años</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nivel:</span>
                  <span className="text-foreground">Intermedio</span>
                </div>
              </div>
            </div>

            {/* Related Standards */}
            <div className="card-elegant p-6">
              <h3 className="font-semibold text-foreground mb-4">Estándares Relacionados</h3>
              <div className="space-y-3">
                {standardsData
                  .filter(s => s.category === standard.category && s.code !== standard.code)
                  .slice(0, 3)
                  .map(relatedStandard => (
                    <Link
                      key={relatedStandard.code}
                      to={`/estandares/${relatedStandard.code}`}
                      className="block p-3 border border-border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className="text-sm font-medium text-primary mb-1">
                        {relatedStandard.code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {relatedStandard.title.substring(0, 60)}...
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardDetailPage;