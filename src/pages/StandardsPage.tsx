import React, { useState } from 'react';
import { standardsData } from '../data/standardsData';
import StandardCard from '../componets/StandardCard';

const StandardsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...Array.from(new Set(standardsData.map(s => s.category)))];
  
  const filteredStandards = standardsData.filter(standard => {
    const matchesCategory = selectedCategory === 'all' || standard.category === selectedCategory;
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    return category === 'all' ? 'Todas las categorías' : category;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Estándares de Competencia
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora nuestro catálogo completo de certificaciones reconocidas por CONOCER 
            y otras instituciones oficiales mexicanas
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="card-elegant p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                  Buscar estándares
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="search"
                    type="text"
                    placeholder="Buscar por nombre, código o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground 
                             placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary 
                             focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Categoría
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
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
            Mostrando {filteredStandards.length} de {standardsData.length} estándares
            {selectedCategory !== 'all' && ` en "${selectedCategory}"`}
            {searchTerm && ` que coinciden con "${searchTerm}"`}
          </p>
          
          {filteredStandards.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Haz clic en cualquier estándar para ver detalles
            </div>
          )}
        </div>

        {/* Standards Grid */}
        {filteredStandards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStandards.map(standard => (
              <StandardCard key={standard.code} standard={standard} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-elegant p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron estándares
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="btn-secondary"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Featured Info */}
        <div className="mt-12 card-elegant p-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">¿Por qué certificarse?</h3>
              <p className="text-muted-foreground text-sm">
                Los Estándares de Competencia son marcos de referencia reconocidos a nivel nacional 
                que validan tus habilidades profesionales. Al certificarte, demuestras tu competencia 
                de manera objetiva y mejoras tus oportunidades laborales en el mercado mexicano.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardsPage;