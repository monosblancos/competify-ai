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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Recursos Certifica Global
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Recursos prácticos para avanzar hoy: ebooks, plantillas, cursos y masterclasses 
              alineados a los estándares CONOCER y a tu plan de carrera.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(resourceTypes).map(([value, label]) => (
                <Button
                  key={value}
                  variant={selectedType === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(value)}
                  className="text-sm"
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="w-px h-8 bg-border"></div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
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
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="todos">Todos los Estándares</option>
              {commonStandards.map(std => (
                <option key={std} value={std}>{std}</option>
              ))}
            </select>

            <Badge variant="secondary" className="ml-4">
              {filteredResources.length} recursos encontrados
            </Badge>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={resource.cover_url || '/placeholder.svg'}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={getTypeColor(resource.type)}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(resource.type)}
                      {resourceTypes[resource.type as keyof typeof resourceTypes]?.replace(/s$/, '')}
                    </span>
                  </Badge>
                  {resource.is_free && (
                    <Badge className="bg-green-500 text-white">GRATIS</Badge>
                  )}
                </div>
                {resource.level && (
                  <Badge variant="secondary" className="absolute top-4 right-4">
                    {resource.level}
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {resource.standards.map(std => (
                      <Badge key={std} variant="outline" className="text-xs">
                        {std}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                    {resource.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {resource.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </div>
                  )}
                  {resource.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {resource.rating.toFixed(1)}
                    </div>
                  )}
                  {resource.total_purchases > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {resource.total_purchases}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    {resource.is_free ? (
                      <div className="text-lg font-bold text-green-600">GRATIS</div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(resource.price_cents)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Acceso de por vida
                        </div>
                      </div>
                    )}
                  </div>
                  <Button asChild className="ml-4">
                    <Link to={`/recursos/${resource.slug}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </div>

                {resource.instructor && (
                  <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                    Instructor: {resource.instructor}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron recursos</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros o términos de búsqueda para encontrar más recursos.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
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
      </section>

      {/* Pricing Notice */}
      <section className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Precios en $ MXN.</strong> IVA incluido si aplica. 
              Garantía de 7 días en todos los recursos de pago.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;