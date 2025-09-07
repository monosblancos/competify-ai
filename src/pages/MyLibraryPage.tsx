import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Play, FileText, Clock, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LibraryResource {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  cover_url: string;
  instructor: string;
  granted_at: string;
  assets: Array<{
    id: string;
    kind: string;
    title: string;
    url: string;
    size_mb: number;
    duration_minutes: number;
  }>;
}

const MyLibraryPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery]);

  const fetchLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_access')
        .select(`
          granted_at,
          expires_at,
          resource_products!inner (
            id,
            slug,
            title,
            subtitle,
            type,
            cover_url,
            instructor,
            resource_assets (
              id,
              kind,
              title,
              url,
              size_mb,
              duration_minutes
            )
          )
        `)
        .eq('user_id', (user as any)?.id)
        .order('granted_at', { ascending: false });

      if (error) throw error;

      const transformedData: LibraryResource[] = data?.map(item => ({
        id: item.resource_products.id,
        slug: item.resource_products.slug,
        title: item.resource_products.title,
        subtitle: item.resource_products.subtitle,
        type: item.resource_products.type,
        cover_url: item.resource_products.cover_url,
        instructor: item.resource_products.instructor,
        granted_at: item.granted_at,
        assets: item.resource_products.resource_assets || []
      })) || [];

      setResources(transformedData);
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'curso':
      case 'masterclass':
        return <Play className="w-5 h-5" />;
      case 'ebook':
      case 'plantilla':
      case 'toolkit':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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

  const getAssetIcon = (kind: string) => {
    switch (kind) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'pdf': case 'zip': return <FileText className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const formatFileSize = (mb: number) => {
    if (!mb) return '';
    if (mb < 1) return `${Math.round(mb * 1024)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tu biblioteca</h2>
          <Button asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Mi Biblioteca
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Accede a todos tus recursos comprados y descargados
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar en mi biblioteca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library Content */}
      <section className="container mx-auto px-4 py-12">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              {resources.length === 0 ? (
                <>
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Tu biblioteca está vacía</h3>
                  <p className="text-muted-foreground mb-6">
                    Comienza explorando nuestros recursos y construye tu biblioteca de conocimiento.
                  </p>
                  <Button asChild>
                    <Link to="/recursos">Explorar Recursos</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron recursos</h3>
                  <p className="text-muted-foreground mb-6">
                    Intenta con otros términos de búsqueda.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Limpiar búsqueda
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Mis Recursos ({filteredResources.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={resource.cover_url || '/placeholder.svg'}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-2 left-2 ${getTypeColor(resource.type)}`}>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(resource.type)}
                          <span className="capitalize">{resource.type}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                    {resource.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.subtitle}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Instructor & Date */}
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      {resource.instructor && (
                        <div className="truncate">
                          <strong>Instructor:</strong> {resource.instructor}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Adquirido: {new Date(resource.granted_at).toLocaleDateString('es-MX')}
                      </div>
                    </div>

                    {/* Assets */}
                    {resource.assets && resource.assets.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-sm">Contenido disponible:</h4>
                        <div className="space-y-1">
                          {resource.assets.slice(0, 3).map((asset) => (
                            <div key={asset.id} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {getAssetIcon(asset.kind)}
                                <span className="truncate">{asset.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                {asset.duration_minutes && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(asset.duration_minutes)}
                                  </span>
                                )}
                                {asset.size_mb && (
                                  <span>{formatFileSize(asset.size_mb)}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {resource.assets.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center py-1">
                              +{resource.assets.length - 3} archivos más...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link to={`/recursos/${resource.slug}`}>
                          Ver Recurso Completo
                        </Link>
                      </Button>
                      
                      {resource.assets && resource.assets.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {resource.assets.slice(0, 2).map((asset) => (
                            <Button 
                              key={asset.id}
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              asChild
                            >
                              <a 
                                href={asset.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {getAssetIcon(asset.kind)}
                                <span className="ml-1 truncate">
                                  {asset.kind === 'video' ? 'Ver' : 'Descargar'}
                                </span>
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MyLibraryPage;