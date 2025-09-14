import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Video, FileText, Users, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ResourceProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  standards: string[];
  level: string;
  sector: string;
  duration: string;
  price_cents: number;
  is_free: boolean;
  cover_url: string;
  instructor: string;
  rating: number;
  total_purchases: number;
  outcomes?: string[] | any;
  target_audience?: string[] | any;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<ResourceProduct[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('todos');
  const [selectedStandard, setSelectedStandard] = useState<string>('todos');

  const resourceTypes = {
    todos: 'Todos los Recursos',
    ebook: 'Ebooks & Guías',
    plantilla: 'Plantillas',
    toolkit: 'Toolkits',
    curso: 'Cursos Cortos',
    masterclass: 'Masterclasses',
    bundle: 'Bundles'
  };

  const levels = ['Básico', 'Intermedio', 'Avanzado'];
  const commonStandards = ['EC0217', 'EC0301', 'EC0366', 'EC0076'];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, selectedType, selectedLevel, selectedStandard]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_products')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.standards.some(std => std.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'todos') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by level
    if (selectedLevel !== 'todos') {
      filtered = filtered.filter(resource => resource.level === selectedLevel);
    }

    // Filter by standard
    if (selectedStandard !== 'todos') {
      filtered = filtered.filter(resource => 
        resource.standards.includes(selectedStandard)
      );
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ebook': return <BookOpen className="w-5 h-5" />;
      case 'plantilla': return <FileText className="w-5 h-5" />;
      case 'toolkit': return <FileText className="w-5 h-5" />;
      case 'curso': return <Video className="w-5 h-5" />;
      case 'masterclass': return <Users className="w-5 h-5" />;
      case 'bundle': return <BookOpen className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ebook': return 'bg-blue-100 text-blue-800';
      case 'plantilla': return 'bg-green-100 text-green-800';
      case 'toolkit': return 'bg-purple-100 text-purple-800';
      case 'curso': return 'bg-orange-100 text-orange-800';
      case 'masterclass': return 'bg-red-100 text-red-800';
      case 'bundle': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-purple-800/90"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badges */}
            <div className="flex justify-center gap-3 mb-8">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                🔥 Oferta Especial
              </Badge>
              <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                ⏰ Solo por tiempo limitado
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Acelera tu Carrera con
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Certificaciones CONOCER
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-4">
              Únete a más de <span className="font-bold text-white">15,847 profesionistas</span> que han transformado su carrera.
            </p>
            
            <p className="text-lg text-blue-200 mb-8">
              Recursos prácticos diseñados específicamente para profesionales de 19-45 
              años que buscan resultados reales.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-8 text-white">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
                <span className="text-blue-200">(2,341 reseñas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-300" />
                <span className="font-semibold">15,847+ estudiantes activos</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <Input
                type="text"
                placeholder="Busca entre 1,845 estándares (código o título)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/10 border-white/20 text-white placeholder:text-purple-200 rounded-xl backdrop-blur-sm"
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Certificación oficial CONOCER
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Acceso de por vida
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Garantía 30 días
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Kit */}
      <section className="relative -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <Badge className="bg-green-500 text-white mb-4">
                    💯 COMPLETAMENTE GRATIS
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Kit Completo de Certificación CONOCER
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Descarga gratis nuestro kit valorado en <span className="font-bold text-purple-600">$2,490</span> con todo lo que necesitas para comenzar tu certificación profesional hoy mismo.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Qué incluye tu kit gratuito:</h3>
                    <div className="space-y-3">
                      {[
                        { icon: "📖", text: "Guía completa: '7 Pasos para Certificarte en CONOCER'", color: "text-blue-600" },
                        { icon: "📋", text: "Plantillas de evaluación editables", color: "text-orange-600" },
                        { icon: "🎯", text: "Test de autoevaluación de competencias", color: "text-red-600" },
                        { icon: "💰", text: "Calculadora de ROI de certificación", color: "text-yellow-600" },
                        { icon: "📈", text: "Plan de carrera personalizable", color: "text-purple-600" },
                        { icon: "🎥", text: "3 masterclasses exclusivas (valor $890)", color: "text-green-600" },
                        { icon: "👥", text: "Acceso a comunidad privada de estudiantes", color: "text-indigo-600" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                          <span className={`text-sm ${item.color} font-medium`}>{item.icon}</span>
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-purple-600 mb-2">$0</div>
                      <div className="text-gray-500 line-through">Valor regular: $2,490</div>
                      <Badge className="bg-green-500 text-white mt-2">
                        100% GRATIS por tiempo limitado
                      </Badge>
                    </div>
                    
                    <Input 
                      type="email" 
                      placeholder="tu-email@ejemplo.com" 
                      className="mb-4"
                    />
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3">
                      <span className="mr-2">📥</span>
                      Descargar Kit Gratis
                    </Button>
                    
                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">📧 No spam, solo contenido valioso</p>
                      <p className="text-xs text-gray-400 mt-1">Más de 15,000 profesionales ya descargaron su kit</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-orange-500 text-white">⚡ OFERTA LIMITADA</Badge>
                    <div>
                      <p className="text-sm text-gray-700">
                        Solo los primeros <span className="font-bold">500 profesionales</span> este mes.
                      </p>
                      <p className="text-xs text-orange-600 font-medium">347 kits restantes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white/80 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <Badge className="bg-purple-100 text-purple-700 mb-2">
              🔍 RECURSOS CERTIFICADOS
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Recursos prácticos para avanzar hoy
            </h2>
            <p className="text-gray-600">
              Ebooks, plantillas, cursos y masterclasses alineados a los estándares CONOCER y diseñados 
              específicamente para impulsar tu plan de carrera profesional.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(resourceTypes).map(([value, label]) => (
                <Button
                  key={value}
                  variant={selectedType === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(value)}
                  className={selectedType === value 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                    : "border-purple-200 text-purple-700 hover:bg-purple-50"
                  }
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="w-px h-8 bg-purple-200"></div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="todos">Todos los Niveles</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Standard Filter */}
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="todos">Todos los Estándares</option>
              {commonStandards.map(std => (
                <option key={std} value={std}>{std}</option>
              ))}
            </select>

            <Badge className="bg-purple-100 text-purple-700 ml-4">
              {filteredResources.length} recursos encontrados
            </Badge>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <Card key={resource.id} className="group hover:shadow-xl transition-all duration-500 overflow-hidden relative bg-white border-0 shadow-lg hover:-translate-y-2">
                {/* Discount Badge */}
                {!resource.is_free && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
                      -20%
                    </Badge>
                  </div>
                )}
                
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-purple-100">
                  {/* Large Standard Code */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl md:text-7xl font-bold text-blue-300/30">
                      {resource.standards[0] || 'EC'}
                    </div>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getTypeColor(resource.type)} font-semibold px-3 py-1`}>
                      {resourceTypes[resource.type as keyof typeof resourceTypes]?.replace(/s$/, '')}
                    </Badge>
                  </div>

                  {/* Special Offers */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {resource.is_free && (
                      <Badge className="bg-green-500 text-white font-bold">GRATIS</Badge>
                    )}
                    {resource.type === 'curso' && (
                      <Badge className="bg-red-500/90 text-white text-xs">Solo 3 días</Badge>
                    )}
                    {resource.type === 'plantilla' && (
                      <Badge className="bg-red-500/90 text-white text-xs">-20%</Badge>
                    )}
                    {resource.type === 'masterclass' && (
                      <Badge className="bg-purple-500/90 text-white text-xs">Últimos cupos</Badge>
                    )}
                  </div>

                  {/* Level Badge */}
                  {resource.level && (
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        {resource.level}
                      </Badge>
                    </div>
                  )}
                </div>

              <CardContent className="p-6">
                {/* Standard and Title */}
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {resource.standards[0] || 'CONOCER'}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                        {resource.standards[0]}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{resource.level}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{resource.duration}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors text-center mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 text-center">
                    {resource.subtitle}
                  </p>
                </div>

                {/* Benefits */}
                <div className="mb-4 space-y-2">
                  {resource.outcomes && Array.isArray(resource.outcomes) && resource.outcomes.slice(0, 3).map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                  {(!resource.outcomes || !Array.isArray(resource.outcomes)) && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Certificación oficial CONOCER</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Contenido actualizado 2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Casos reales y plantillas</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4 border-t border-b border-gray-100 py-3">
                  {resource.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-medium">{resource.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {resource.total_purchases > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{resource.total_purchases.toLocaleString()} estudiantes</span>
                    </div>
                  )}
                </div>

                {/* Pricing and CTA */}
                <div className="text-center">
                  {resource.is_free ? (
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">GRATIS</div>
                      <div className="text-xs text-gray-500">Descarga inmediata</div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(Math.round(resource.price_cents * 1.25))}
                        </span>
                        <Badge className="bg-red-500 text-white text-xs">-20%</Badge>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPrice(resource.price_cents)}
                      </div>
                      <div className="text-xs text-gray-500">Acceso de por vida</div>
                    </div>
                  )}
                  
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    <Link to={`/recursos/${resource.slug}`}>
                      {resource.is_free ? 'Descargar Gratis' : 'Ver Detalles'}
                    </Link>
                  </Button>
                </div>

                {/* Instructor */}
                {resource.instructor && (
                  <div className="mt-4 pt-3 border-t text-center text-xs text-gray-500">
                    Por {resource.instructor}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No se encontraron recursos</h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o términos de búsqueda para encontrar más recursos.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('todos');
                    setSelectedLevel('todos');
                    setSelectedStandard('todos');
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              👑 Certificado por CONOCER
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Más de 15,000 profesionales confían en nosotros
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estudiantes de empresas líderes en México han transformado sus carreras con 
              nuestras certificaciones
            </p>
          </div>

          {/* Company Logos */}
          <div className="flex items-center justify-center gap-8 mb-12 opacity-60">
            {['PEMEX', 'Grupo Bimbo', 'Telmex', 'BBVA', 'Walmart', 'Oxxo', 'Liverpool', 'Coppel'].map((company, index) => (
              <span key={index} className="text-gray-400 font-semibold text-sm">{company}</span>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "María González",
                role: "Gerente de RH",
                company: "Grupo Bimbo • 28 años",
                testimonial: "Obtuve mi certificación EC0217 en tiempo récord. El contenido es súper práctico y ya estoy aplicando todo en mi trabajo. Mi jefe quedó impresionado.",
                result: "+35% aumento salarial",
                time: "3 meses después",
                rating: 5
              },
              {
                name: "Carlos Rodríguez",
                role: "Consultor Independiente",
                company: "Freelancer • 34 años",
                testimonial: "Como freelancer, estas certificaciones me han abierto puertas increíbles. Ahora puedo cobrar el doble por mis servicios de capacitación.",
                result: "x2 ingresos mensuales",
                time: "6 meses después",
                rating: 5
              },
              {
                name: "Ana Martínez",
                role: "Coordinadora de Capacitación",
                company: "PEMEX • 31 años",
                testimonial: "La metodología es excelente. Estudié mientras trabajaba y tengo dos hijos. Si yo pude, cualquiera puede. ¡Totalmente recomendado!",
                result: "Promoción a subdirectora",
                time: "4 meses después",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-0 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-gray-700 text-sm mb-4 italic">
                  "{testimonial.testimonial}"
                </blockquote>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-green-600 font-semibold text-sm">{testimonial.result}</div>
                  <div className="text-gray-500 text-xs">{testimonial.time}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 text-sm">Tasa de aprobación</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15,847</div>
              <div className="text-gray-600 text-sm">Estudiantes activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-1">
                4.9 <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-gray-600 text-sm">Calificación promedio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">+47%</div>
              <div className="text-gray-600 text-sm">Aumento salarial promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para acelerar tu carrera profesional?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Únete a más de 15,847 profesionales que ya transformaron su futuro
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                <Link to="/diagnostico">
                  🚀 Comienza Gratis Ahora
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
              >
                <Link to="/programas">
                  Ver Másters Completos
                </Link>
              </Button>
            </div>
            <div className="text-sm text-purple-200">
              <strong>Precios en $ MXN.</strong> IVA incluido si aplica. • 
              Garantía de 30 días en todos los recursos de pago. • 
              Más de 15,000 estudiantes satisfechos.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;