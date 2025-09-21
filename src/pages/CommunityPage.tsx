import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCommunity } from '@/hooks/useCommunity';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Heart,
  BookOpen,
  Target,
  Award,
  Lightbulb
} from 'lucide-react';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useCommunity();

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Acceso requerido
          </h1>
          <p className="text-muted-foreground">
            Debes iniciar sesión para acceder a la comunidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityFeed />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Estadísticas de Comunidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Posts totales</span>
                  </div>
                  <Badge variant="secondary">{stats.totalPosts}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Miembros activos</span>
                  </div>
                  <Badge variant="secondary">2,543</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Grupos</span>
                  </div>
                  <Badge variant="secondary">{stats.totalGroups}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Conexiones</span>
                  </div>
                  <Badge variant="secondary">{stats.myConnections}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Categorías Populares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Certificaciones', count: 245, color: 'bg-green-100 text-green-700' },
                  { name: 'Tecnología', count: 189, color: 'bg-blue-100 text-blue-700' },
                  { name: 'Networking', count: 156, color: 'bg-purple-100 text-purple-700' },
                  { name: 'Empleo', count: 134, color: 'bg-orange-100 text-orange-700' },
                  { name: 'Recursos', count: 98, color: 'bg-indigo-100 text-indigo-700' }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{category.name}</span>
                    <Badge className={category.color}>
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Normas de la Comunidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <Award className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Mantén un tono profesional y respetuoso</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Comparte conocimientos y experiencias valiosas</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Apoya a otros miembros de la comunidad</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Utiliza las categorías apropiadas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Grupos Destacados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Especialistas en IA', members: 1245, topic: 'Inteligencia Artificial' },
                  { name: 'Líderes Digitales', members: 987, topic: 'Liderazgo Digital' },
                  { name: 'Data Scientists MX', members: 756, topic: 'Ciencia de Datos' },
                  { name: 'UX/UI Profesionales', members: 634, topic: 'Diseño de Experiencia' }
                ].map((group, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">{group.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {group.members}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{group.topic}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;