import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ModuleListItem from '../componets/ModuleListItem';
import { Progress } from '../components/ui/progress';
import { 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle,
  Bell,
  MessageCircle,
  Play
} from 'lucide-react';

interface Standard {
  code: string;
  title: string;
  description: string;
  category: string;
  modules: any[];
  is_core_offering: boolean;
}

const StandardDetailPage: React.FC = () => {
  const { standardCode } = useParams<{ standardCode: string }>();
  const navigate = useNavigate();
  const [standard, setStandard] = useState<Standard | null>(null);
  const [relatedStandards, setRelatedStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { 
    isEnrolled, 
    startCertification, 
    toggleModuleCompletion, 
    getModuleStatus, 
    getCertificationProgress 
  } = useAuth();

  useEffect(() => {
    const fetchStandardData = async () => {
      if (!standardCode) return;
      
      try {
        // Fetch the specific standard
        const { data: standardData, error: standardError } = await supabase
          .from('standards')
          .select('*')
          .eq('code', standardCode)
          .maybeSingle();

        if (standardError) throw standardError;
        setStandard({
          ...standardData,
          modules: standardData.modules as any[] || []
        });

        // Fetch related standards (same category)
        if (standardData) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('standards')
            .select('*')
            .eq('category', standardData.category)
            .neq('code', standardCode)
            .limit(3);

          if (relatedError) throw relatedError;
          setRelatedStandards((relatedData || []).map(s => ({
            ...s,
            modules: s.modules as any[] || []
          })));
        }
      } catch (error) {
        console.error('Error fetching standard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandardData();
  }, [standardCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-muted rounded-lg mb-8"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
  const totalDuration = standard.modules?.reduce((acc, module) => 
    acc + (module.duration ? parseInt(module.duration) : 2), 0
  ) || 0;

  const handleEnroll = () => {
    startCertification(standard.code);
    // Redirect to My Courses page after enrollment
    setTimeout(() => {
      navigate('/mis-cursos');
    }, 100);
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
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                    {standard.is_core_offering && (
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
                  <Progress value={progress} className="h-3" />
                  {progress === 100 && (
                    <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-success text-sm font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ¡Felicitaciones! Has completado todos los módulos de este estándar.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{standard.modules?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{totalDuration}h</div>
                  <div className="text-sm text-muted-foreground">Duración</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <Users className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">
                    {standard.modules?.filter(m => m.isPractical).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Prácticos</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <Award className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">
                    {standard.modules?.filter(m => !m.isPractical).length || 0}
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
                    className="btn-primary flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Certificación
                  </button>
                )}
              </div>
              
              {standard.modules?.map((module, index) => {
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
            {/* Action Card - Smart CTA Logic */}
            <div className="card-elegant p-6">
              {!enrolled ? (
                <div className="text-center">
                  {standard.is_core_offering ? (
                    // Core Offering - Prominent enrollment button
                    <>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        ¡Inscríbete Ahora!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Esta certificación está disponible inmediatamente. Comienza tu proceso de certificación ahora mismo.
                      </p>
                      <button
                        onClick={handleEnroll}
                        className="w-full btn-hero mb-3 flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Inscribirme Ahora
                      </button>
                      <p className="text-xs text-muted-foreground">
                        Gratis • Sin compromiso • Progreso guardado
                      </p>
                    </>
                  ) : (
                    // Non-core offering - Advisory text and alternative buttons
                    <>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Próximamente Disponible
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Esta certificación estará disponible pronto. Mientras tanto, puedes solicitar notificaciones o hablar con uno de nuestros asesores.
                      </p>
                      <div className="space-y-3">
                        <button className="w-full btn-primary flex items-center justify-center">
                          <Bell className="w-4 h-4 mr-2" />
                          Notifícame cuando esté disponible
                        </button>
                        <button className="w-full btn-secondary flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Hablar con un asesor
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
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
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Disponibilidad:</span>
                  <span className={`text-foreground ${standard.is_core_offering ? 'text-success' : 'text-warning'}`}>
                    {standard.is_core_offering ? 'Inmediata' : 'Próximamente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Standards */}
            {relatedStandards.length > 0 && (
              <div className="card-elegant p-6">
                <h3 className="font-semibold text-foreground mb-4">Estándares Relacionados</h3>
                <div className="space-y-3">
                  {relatedStandards.map(relatedStandard => (
                    <Link
                      key={relatedStandard.code}
                      to={`/estandares/${relatedStandard.code}`}
                      className="block p-3 border border-border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-primary">
                          {relatedStandard.code}
                        </div>
                        {relatedStandard.is_core_offering && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            Disponible
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {relatedStandard.title.substring(0, 60)}...
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardDetailPage;