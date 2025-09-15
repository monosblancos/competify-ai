import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import StandardCard from '../componets/StandardCard';
import { Search, Filter, Book, Award } from 'lucide-react';

interface Standard {
  code: string;
  title: string;
  description: string;
  category: string;
  modules: any[];
  is_core_offering: boolean;
}

const StandardsPage: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const { data, error } = await supabase
          .from('standards')
          .select('*')
          .order('code');

        if (error) throw error;
        setStandards((data || []).map(s => ({
          ...s,
          modules: s.modules as any[] || []
        })));
      } catch (error) {
        console.error('Error fetching standards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandards();
  }, []);

  const categories = ['all', ...Array.from(new Set(standards.map(s => s.category)))];
  
  const filteredStandards = standards.filter(standard => {
    const matchesCategory = selectedCategory === 'all' || standard.category === selectedCategory;
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    return category === 'all' ? 'Todas las categorías' : category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 mx-auto px-4 py-16">
          {/* Main Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">Metodología Certifica Global™</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforma tu<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Experiencia Profesional
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
              Conviértete en un profesional certificado siguiendo nuestro sistema de 
              <strong className="text-yellow-300"> 9 pasos estratégicos</strong> respaldado por 
              <strong className="text-yellow-300"> 8 dimensiones</strong> de transformación integral
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">+2,500</div>
                <div className="text-white/80 text-sm">Profesionales Certificados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">95%</div>
                <div className="text-white/80 text-sm">Tasa de Aprobación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">{standards.length}+</div>
                <div className="text-white/80 text-sm">Estándares Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">85%</div>
                <div className="text-white/80 text-sm">Mejora Salarial</div>
              </div>
            </div>
          </div>

          {/* Lead Magnet Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">🎁 Kit de Transformación Profesional GRATIS</h2>
                <p className="text-white/90 mb-6">
                  Descarga ahora los recursos que necesitas para iniciar tu certificación
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
                  <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book className="w-8 h-8 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Guía de 9 Pasos</h3>
                  <p className="text-white/80 text-sm">Metodología completa para tu certificación exitosa</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
                  <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Evaluador Gratuito</h3>
                  <p className="text-white/80 text-sm">Descubre tu perfil ideal de certificación en 3 minutos</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
                  <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Plantillas Premium</h3>
                  <p className="text-white/80 text-sm">Formatos profesionales para tu portafolio de evidencias</p>
                </div>
              </div>
              
              <div className="text-center">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg">
                  Descargar Kit Gratuito 📥
                </button>
                <p className="text-white/70 text-sm mt-3">
                  ✅ Descarga instantánea • ✅ Sin spam • ✅ 100% gratis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Metodología Certifica Global™
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un sistema probado de transformación profesional basado en 9 pasos secuenciales 
              y 8 dimensiones clave que garantizan tu éxito certificador
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 9 Pasos */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">9</span>
                Pasos Estratégicos
              </h3>
              <div className="space-y-3">
                {[
                  'Activación de Identidad Profesional',
                  'Definición del Propósito Transformador',
                  'Diseño Estratégico del Aprendizaje',
                  'Activadores de Aprendizaje y Reflexión',
                  'Fortalecimiento del Portafolio de Evidencias',
                  'Simulación de Evaluación + Retroalimentación',
                  'Evaluación Formal y Logro de Certificación',
                  'Visibilización y Posicionamiento del Perfil',
                  'Expansión de Impacto y Liderazgo Multiplicador'
                ].map((paso, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm font-medium">{paso}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 8 Dimensiones */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">8</span>
                Dimensiones Clave
              </h3>
              <div className="space-y-3">
                {[
                  'Identitaria: Conecta con tu autenticidad',
                  'Transformadora: Genera cambios reales',
                  'Estratégica: Proceso secuenciado',
                  'Técnica: Herramientas verificables',
                  'Emocional-reflexiva: Activa compromiso',
                  'Transferencia laboral: Impacto real',
                  'Ética y social: Cambio sostenible',
                  'Evaluación integral: Seguimiento continuo'
                ].map((dimension, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm font-medium">{dimension}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground 
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
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Mostrando {filteredStandards.length} de {standards.length} estándares
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
              <StandardCard 
                key={standard.code} 
                standard={{
                  ...standard,
                  isCoreOffering: standard.is_core_offering
                }} 
              />
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
              <Award className="w-6 h-6 text-primary" />
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