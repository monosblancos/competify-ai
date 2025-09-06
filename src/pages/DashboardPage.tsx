import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StandardCard from '../componets/StandardCard';
import { Progress } from '../components/ui/progress';
import { BarChart3, TrendingUp, Users, Briefcase, Brain, ArrowUpRight } from 'lucide-react';

interface Standard {
  code: string;
  title: string;
  description: string;
  category: string;
  modules: any[];
  is_core_offering: boolean;
}

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  required_standards: string[];
}

const DashboardPage: React.FC = () => {
  const { user, lastAnalysis, progress } = useAuth();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch standards
        const { data: standardsData, error: standardsError } = await supabase
          .from('standards')
          .select('*');

        // Fetch job openings (limit to 4 for dashboard)
        const { data: jobsData, error: jobsError } = await supabase
          .from('job_openings')
          .select('*')
          .limit(4);

        if (standardsError) throw standardsError;
        if (jobsError) throw jobsError;

        setStandards((standardsData || []).map(s => ({
          ...s,
          modules: s.modules as any[] || []
        })));
        setJobOpenings(jobsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrolledStandards = Object.keys(progress);
  const enrolledStandardsData = standards.filter(s => enrolledStandards.includes(s.code));

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-muted rounded w-2/3 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Link to="/analisis-cv" className="card-glow p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Analizar CV</h3>
                <p className="text-sm text-muted-foreground">Descubre certificaciones recomendadas</p>
              </div>
            </div>
          </Link>

          <Link to="/estandares" className="card-glow p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Explorar Estándares</h3>
                <p className="text-sm text-muted-foreground">Certificaciones disponibles</p>
              </div>
            </div>
          </Link>

          <Link to="/oportunidades" className="card-glow p-6 group hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">Ver Oportunidades</h3>
                <p className="text-sm text-muted-foreground">Empleos compatibles</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mi Plan de Carrera Profesional */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  Mi Plan de Carrera Profesional
                </h2>
                {enrolledStandards.length > 0 && (
                  <Link to="/mis-cursos" className="btn-secondary">Ver Todos</Link>
                )}
              </div>
              
              {enrolledStandards.length > 0 ? (
                <div className="grid gap-6">
                  {enrolledStandardsData.map(standard => {
                    const progressPercent = Math.round((progress[standard.code]?.completedModules?.length || 0) / (standard.modules?.length || 1) * 100);
                    return (
                      <div key={standard.code} className="card-elegant p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                {standard.code}
                              </span>
                              {standard.is_core_offering && (
                                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                                  DESTACADO
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{standard.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{standard.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-primary">{progressPercent}%</div>
                            <div className="text-xs text-muted-foreground">Completado</div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {progress[standard.code]?.completedModules?.length || 0} de {standard.modules?.length || 0} módulos
                          </span>
                          <Link 
                            to={`/estandares/${standard.code}`}
                            className="text-primary hover:text-primary/80 font-medium flex items-center"
                          >
                            Continuar
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card-elegant p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Comienza tu plan de carrera</h3>
                  <p className="text-muted-foreground mb-4">
                    Inscríbete en certificaciones para comenzar tu desarrollo profesional
                  </p>
                  <Link to="/estandares" className="btn-primary">
                    Explorar Certificaciones
                  </Link>
                </div>
              )}
            </section>

            {/* Radar de Vacantes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-primary" />
                  Radar de Vacantes
                </h2>
                <Link to="/oportunidades" className="btn-secondary">Ver Todas</Link>
              </div>
              
              <div className="grid gap-4">
                {jobOpenings.slice(0, 4).map(job => (
                  <div key={job.id} className="card-elegant p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                        <p className="text-sm text-primary font-medium mb-2">{job.company}</p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Ubicación:</span>
                          <span className="text-xs text-foreground">{job.location}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">Certificaciones</div>
                        <div className="space-y-1">
                          {job.required_standards.slice(0, 2).map(code => (
                            <div key={code} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {code}
                            </div>
                          ))}
                          {job.required_standards.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{job.required_standards.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {enrolledStandards.some(code => job.required_standards.includes(code)) && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            ✓ Certificación compatible
                          </span>
                        )}
                      </div>
                      <Link 
                        to="/oportunidades"
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Análisis IA */}
            <section className="card-elegant p-6">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 mr-2 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Análisis IA</h3>
              </div>
              
              {lastAnalysis ? (
                <div>
                  <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-1">Certificación Recomendada</h4>
                    <div className="text-sm font-mono text-foreground">{lastAnalysis.recommendedStandard.code}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{lastAnalysis.recommendedStandard.title}</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-foreground mb-2 flex items-center">
                        <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                        Fortalezas
                      </h5>
                      <ul className="space-y-1">
                        {lastAnalysis.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-foreground mb-2 flex items-center">
                        <span className="w-2 h-2 bg-warning rounded-full mr-2"></span>
                        Áreas de Mejora
                      </h5>
                      <ul className="space-y-1">
                        {lastAnalysis.opportunities.slice(0, 3).map((opportunity, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Link 
                    to="/analisis-cv" 
                    className="w-full btn-secondary mt-4 text-center block"
                  >
                    Nuevo Análisis
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Sin análisis previo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analiza tu CV para recibir recomendaciones personalizadas
                  </p>
                  <Link to="/analisis-cv" className="w-full btn-primary">
                    Analizar CV
                  </Link>
                </div>
              )}
            </section>

            {/* Stats Card */}
            <section className="card-elegant p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Tu Progreso
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Certificaciones inscritas</span>
                  <span className="font-semibold text-foreground">{enrolledStandards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Módulos completados</span>
                  <span className="font-semibold text-foreground">
                    {Object.values(progress).reduce((acc, p) => acc + (p.completedModules?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Empleos compatibles</span>
                  <span className="font-semibold text-foreground">
                    {jobOpenings.filter(job => 
                      job.required_standards.some(code => enrolledStandards.includes(code))
                    ).length}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Get Started CTA */}
        {enrolledStandards.length === 0 && !lastAnalysis && (
          <div className="text-center py-12 mt-12">
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