import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';
import { Search, MapPin, Briefcase, TrendingUp } from 'lucide-react';

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  required_standards: string[];
}

const OpportunitiesPage: React.FC = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
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
  
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesLocation;
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Briefcase className="w-10 h-10 mr-3 text-primary" />
            Radar de Oportunidades
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre empleos que coinciden con tus certificaciones actuales y potenciales. 
            Mientras más estándares tengas, mejor será tu compatibilidad.
          </p>
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
              
              return (
                <div key={job.id} className="card-elegant p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        {compatibility.percentage > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              compatibility.percentage >= 80 ? 'bg-success/10 text-success' :
                              compatibility.percentage >= 50 ? 'bg-warning/10 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {compatibility.percentage}% Compatible
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-primary font-medium">{job.company}</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Certificaciones requeridas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.required_standards.map(standard => {
                            const isMatched = compatibility.matchedStandards.includes(standard);
                            return (
                              <span 
                                key={standard}
                                className={`px-3 py-1 rounded-full text-sm font-mono ${
                                  isMatched 
                                    ? 'bg-success/10 text-success border border-success/20' 
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {standard}
                                {isMatched && ' ✓'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {compatibility.percentage < 100 && compatibility.percentage > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-sm text-foreground">
                        <strong>Mejora tu compatibilidad:</strong> Te faltan {job.required_standards.length - compatibility.matchedStandards.length} certificaciones para ser 100% compatible con este empleo.
                      </p>
                    </div>
                  )}
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