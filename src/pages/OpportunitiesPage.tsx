import React, { useState } from 'react';
import { jobData } from '../data/jobData';
import JobCard from '../components/JobCard';

const OpportunitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const locations = ['all', ...Array.from(new Set(jobData.map(job => job.location)))];
  
  const filteredJobs = jobData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const getLocationLabel = (location: string) => {
    return location === 'all' ? 'Todas las ubicaciones' : location;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Oportunidades Laborales
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre empleos que requieren las certificaciones de nuestro catálogo.
            Tu compatibilidad se calcula basándose en tu progreso actual.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="card-elegant p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="job-search" className="block text-sm font-medium text-foreground mb-2">
                  Buscar oportunidades
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="job-search"
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
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {getLocationLabel(location)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Mostrando {filteredJobs.length} de {jobData.length} oportunidades
            {selectedLocation !== 'all' && ` en ${selectedLocation}`}
            {searchTerm && ` que coinciden con "${searchTerm}"`}
          </p>
          
          {filteredJobs.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              La compatibilidad se basa en tu progreso de certificación
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-elegant p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
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
        <div className="card-elegant p-6 mb-12">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            ¿Cómo se calcula la compatibilidad?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="w-4 h-4 bg-success rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-medium text-foreground">Alta (70%+)</h4>
                <p className="text-sm text-muted-foreground">
                  Tienes la mayoría de certificaciones requeridas para este puesto
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-4 h-4 bg-warning rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-medium text-foreground">Media (40-69%)</h4>
                <p className="text-sm text-muted-foreground">
                  Tienes algunas certificaciones, pero necesitas completar más
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-4 h-4 bg-destructive rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-medium text-foreground">Baja (&lt;40%)</h4>
                <p className="text-sm text-muted-foreground">
                  Necesitas obtener las certificaciones requeridas para este puesto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-elegant p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ¿Quieres mejorar tu compatibilidad?
            </h2>
            <p className="text-muted-foreground mb-6">
              Completa más certificaciones para acceder a mejores oportunidades laborales.
              Analiza tu CV para recibir recomendaciones personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/analisis-cv" className="btn-primary">
                Analizar mi CV
              </a>
              <a href="/estandares" className="btn-secondary">
                Ver Certificaciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;