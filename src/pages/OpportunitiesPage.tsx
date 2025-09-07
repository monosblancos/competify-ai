import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';
import { Search, MapPin, Briefcase, TrendingUp, Users, Calendar, DollarSign, Target } from 'lucide-react';

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  required_standards: string[];
  salary_min?: number;
  salary_max?: number;
  modality?: string;
  posted_date?: string;
  benefits?: string[];
  requirements?: string[];
  level?: string;
}

const OpportunitiesPage: React.FC = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const { progress } = useAuth();

  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        const { data, error } = await supabase
          .from('job_openings')
          .select('*')
          .order('title');

        if (error) throw error;
        setJobOpenings(data || []);
      } catch (error) {
        console.error('Error fetching job openings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOpenings();
  }, []);

  const locations = ['all', ...Array.from(new Set(jobOpenings.map(job => job.location)))];
  const levels = ['all', ...Array.from(new Set(jobOpenings.map(job => job.level).filter(Boolean)))];
  
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesLevel = selectedLevel === 'all' || job.level === selectedLevel;
    return matchesSearch && matchesLocation && matchesLevel;
  });

  // Calculate compatibility based on user's enrolled standards
  const getJobCompatibility = (jobRequiredStandards: string[]) => {
    const userStandards = Object.keys(progress);
    const matches = jobRequiredStandards.filter(standard => userStandards.includes(standard));
    return {
      percentage: jobRequiredStandards.length > 0 ? Math.round((matches.length / jobRequiredStandards.length) * 100) : 0,
      matchedStandards: matches
    };
  };

  // Sort jobs by compatibility
  const sortedJobs = filteredJobs.sort((a, b) => {
    const compatibilityA = getJobCompatibility(a.required_standards).percentage;
    const compatibilityB = getJobCompatibility(b.required_standards).percentage;
    return compatibilityB - compatibilityA;
  });

  // Calculate statistics
  const stats = {
    totalOpportunities: jobOpenings.length,
    newThisWeek: jobOpenings.filter(job => {
      if (!job.posted_date) return false;
      const postedDate = new Date(job.posted_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postedDate > weekAgo;
    }).length,
    averageCompatibility: Math.round(
      sortedJobs.reduce((acc, job) => acc + getJobCompatibility(job.required_standards).percentage, 0) / sortedJobs.length || 0
    ),
    averageSalary: Math.round(
      jobOpenings.filter(job => job.salary_min && job.salary_max)
        .reduce((acc, job) => acc + ((job.salary_min! + job.salary_max!) / 2), 0) / 
        jobOpenings.filter(job => job.salary_min && job.salary_max).length || 0
    )
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Oportunidades Laborales
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre vacantes que coinciden con tus certificaciones CONOCER y perfil profesional
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-elegant p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Briefcase className="w-8 h-8 text-primary mr-2" />
              <span className="text-3xl font-bold text-foreground">{stats.totalOpportunities}</span>
            </div>
            <p className="text-sm text-muted-foreground">Oportunidades disponibles</p>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-success mr-2" />
              <span className="text-3xl font-bold text-foreground">{stats.newThisWeek}</span>
            </div>
            <p className="text-sm text-muted-foreground">Nuevas esta semana</p>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-warning mr-2" />
              <span className="text-3xl font-bold text-foreground">{stats.averageCompatibility}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Compatibilidad promedio</p>
          </div>
          
          <div className="card-elegant p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-8 h-8 text-primary mr-2" />
              <span className="text-3xl font-bold text-foreground">${stats.averageSalary.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Salario promedio</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="card-elegant p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                  Buscar oportunidades
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Buscar por puesto, empresa o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground 
                             placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary 
                             focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="md:w-64">
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    id="location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="all">Todas las ubicaciones</option>
                    {locations.slice(1).map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level Filter */}
              <div className="md:w-64">
                <label htmlFor="level" className="block text-sm font-medium text-foreground mb-2">
                  Nivel
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    id="level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="all">Todos los niveles</option>
                    {levels.slice(1).map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Mostrando {sortedJobs.length} de {jobOpenings.length} oportunidades
            {selectedLocation !== 'all' && ` en "${selectedLocation}"`}
            {searchTerm && ` que coinciden con "${searchTerm}"`}
          </p>
          
          {Object.keys(progress).length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-1" />
              Ordenado por compatibilidad
            </div>
          )}
        </div>

        {/* Job Listings */}
        {sortedJobs.length > 0 ? (
          <div className="space-y-6 mb-12">
            {sortedJobs.map(job => {
              const compatibility = getJobCompatibility(job.required_standards);
              const formatSalary = (min?: number, max?: number) => {
                if (!min || !max) return null;
                return `$${min.toLocaleString()} - $${max.toLocaleString()} MXN`;
              };
              
              const formatDate = (dateString?: string) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) return 'Hace 1 día';
                if (diffDays < 7) return `Hace ${diffDays} días`;
                if (diffDays < 14) return 'Hace 1 semana';
                return `Hace ${Math.ceil(diffDays / 7)} semanas`;
              };
              
              return (
                <div key={job.id} className="card-elegant p-6 hover:shadow-lg transition-shadow">
                  {/* Header with match percentage */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        {compatibility.percentage > 0 && (
                          <div className={`px-4 py-2 rounded-lg text-lg font-bold ${
                            compatibility.percentage >= 80 ? 'bg-primary text-primary-foreground' :
                            compatibility.percentage >= 50 ? 'bg-warning text-warning-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {compatibility.percentage}% match
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-primary font-medium">{job.company}</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        {job.posted_date && (
                          <span className="text-sm text-muted-foreground">
                            {formatDate(job.posted_date)}
                          </span>
                        )}
                      </div>

                      {/* Salary and Modality */}
                      <div className="flex items-center space-x-4 mb-4">
                        {formatSalary(job.salary_min, job.salary_max) && (
                          <span className="text-lg font-semibold text-success">
                            {formatSalary(job.salary_min, job.salary_max)}
                          </span>
                        )}
                        {job.modality && (
                          <span className="text-sm text-muted-foreground">
                            {job.modality} • Tiempo completo
                          </span>
                        )}
                        {job.level && (
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Nivel {job.level}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      
                      {/* Requirements and Benefits Grid */}
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Requisitos principales</h4>
                          <ul className="space-y-1">
                            {job.required_standards.map(standard => (
                              <li key={standard} className="text-sm text-muted-foreground flex items-center">
                                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                Certificación CONOCER {standard}
                              </li>
                            ))}
                            {job.requirements?.map((req, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Beneficios</h4>
                            <ul className="space-y-1">
                              {job.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* CONOCER Standards */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-3">Certificaciones CONOCER relevantes</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.required_standards.map(standard => {
                            const isMatched = compatibility.matchedStandards.includes(standard);
                            return (
                              <span 
                                key={standard}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                  isMatched 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {standard}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                          Guardar
                        </button>
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          Aplicar ahora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-elegant p-8 max-w-md mx-auto">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron oportunidades
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('all');
                  setSelectedLevel('all');
                }}
                className="btn-secondary"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Compatibility Legend */}
        <div className="card-elegant p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            ¿Cómo se calcula la compatibilidad?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-success rounded-full mr-2"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">80-100%:</strong> Muy compatible
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-warning rounded-full mr-2"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">50-79%:</strong> Moderadamente compatible
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-muted rounded-full mr-2"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">0-49%:</strong> Baja compatibilidad
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            La compatibilidad se basa en el porcentaje de certificaciones requeridas que ya tienes o estás cursando.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-elegant p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Mejora tu perfil profesional
            </h2>
            <p className="text-muted-foreground mb-6">
              Obtén más certificaciones para aumentar tu compatibilidad con las mejores oportunidades laborales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analisis-cv" className="btn-primary">
                Analizar mi CV
              </Link>
              <Link to="/estandares" className="btn-secondary">
                Ver Certificaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;