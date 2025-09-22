import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { useNetworking } from '@/hooks/useNetworking';
import { UserConnection, UserProfile } from '@/types/community';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Search, 
  MessageCircle,
  Calendar,
  GraduationCap,
  Target,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper functions moved outside the component
const getConnectionStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'accepted':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Users className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'accepted':
      return 'Conectado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Sin conexión';
  }
};

export const NetworkingHub: React.FC = () => {
  const { 
    connections, 
    suggestedUsers, 
    loading,
    sendConnectionRequest, 
    respondToConnection,
    fetchMessages
  } = useNetworking();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suggested');

  // Filter suggested users based on search
  const filteredSuggestions = suggestedUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.education_level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter connections by status
  const pendingConnections = connections.filter(conn => conn.status === 'pending');
  const acceptedConnections = connections.filter(conn => conn.status === 'accepted');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-muted rounded w-full mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Networking Profesional
          </h2>
          <p className="text-muted-foreground">
            Conecta con profesionales de tu sector y expande tu red
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {acceptedConnections.length}
                </div>
                <div className="text-sm text-muted-foreground">Conexiones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {pendingConnections.length}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {suggestedUsers.length}
                </div>
                <div className="text-sm text-muted-foreground">Sugerencias</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round((acceptedConnections.length / (acceptedConnections.length + pendingConnections.length + 1)) * 100) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa Conexión</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar profesionales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggested" className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Sugerencias</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pendientes ({pendingConnections.length})</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Mis Conexiones</span>
          </TabsTrigger>
        </TabsList>

        {/* Suggested Users */}
        <TabsContent value="suggested" className="space-y-4">
          {filteredSuggestions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuggestions.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onConnect={() => sendConnectionRequest(user.id)}
                  onMessage={() => fetchMessages(user.id)}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserPlus}
              title="No hay sugerencias"
              description={searchQuery ? "No se encontraron usuarios con esa búsqueda" : "No hay usuarios sugeridos en este momento"}
            />
          )}
        </TabsContent>

        {/* Pending Connections */}
        <TabsContent value="pending" className="space-y-4">
          {pendingConnections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingConnections.map(connection => {
                const user = connection.requester_profile || connection.addressee_profile;
                const userId = connection.requester_id === (user as any)?.id ? connection.addressee_id : connection.requester_id;
                const isIncoming = connection.addressee_id !== userId;
                
                return (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    user={{...user, id: userId} as UserProfile}
                    isIncoming={isIncoming}
                    onAccept={() => respondToConnection(connection.id, 'accepted')}
                    onReject={() => respondToConnection(connection.id, 'rejected')}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No hay solicitudes pendientes"
              description="Todas las solicitudes de conexión han sido procesadas"
            />
          )}
        </TabsContent>

        {/* My Connections */}
        <TabsContent value="connections" className="space-y-4">
          {acceptedConnections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedConnections.map(connection => {
                const user = connection.requester_profile || connection.addressee_profile;
                const userId = connection.requester_id === (user as any)?.id ? connection.addressee_id : connection.requester_id;
                return (
                  <UserCard
                    key={connection.id}
                    user={{...user, id: userId} as UserProfile}
                    onMessage={() => fetchMessages(userId)}
                    connectionDate={connection.created_at}
                    showActions={false}
                    isConnected={true}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No tienes conexiones aún"
              description="Envía solicitudes de conexión para comenzar a expandir tu red profesional"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// User Card Component
interface UserCardProps {
  user: UserProfile | undefined;
  onConnect?: () => void;
  onMessage?: () => void;
  connectionDate?: string;
  showActions?: boolean;
  isConnected?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onConnect, 
  onMessage, 
  connectionDate,
  showActions = true,
  isConnected = false
}) => {
  if (!user) return null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">
              {user.full_name || 'Usuario'}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            {connectionDate && (
              <p className="text-xs text-muted-foreground">
                Conectado {formatDistanceToNow(new Date(connectionDate), { addSuffix: true, locale: es })}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Education Level */}
        {user.education_level && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{user.education_level}</span>
          </div>
        )}

        {/* Objectives */}
        {user.objectives && (
          <div className="flex items-start space-x-2">
            <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {user.objectives}
            </p>
          </div>
        )}

        {/* Connection Status */}
        {user.connection_status && (
          <Badge variant="outline" className="w-fit">
            {getConnectionStatusIcon(user.connection_status)}
            <span className="ml-1">{getStatusLabel(user.connection_status)}</span>
          </Badge>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            {!isConnected && onConnect && (
              <Button
                size="sm"
                onClick={onConnect}
                disabled={user.connection_status === 'pending'}
                className="flex-1"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {user.connection_status === 'pending' ? 'Enviada' : 'Conectar'}
              </Button>
            )}
            {onMessage && (
              <Button
                size="sm"
                variant="outline"
                onClick={onMessage}
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Mensaje
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Connection Card Component
interface ConnectionCardProps {
  connection: UserConnection;
  user: UserProfile | undefined;
  isIncoming: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  user,
  isIncoming,
  onAccept,
  onReject
}) => {
  if (!user) return null;

  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">
              {user.full_name || 'Usuario'}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(connection.created_at), { addSuffix: true, locale: es })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Badge variant="outline" className="w-fit">
          <Clock className="w-3 h-3 mr-1" />
          {isIncoming ? 'Solicitud recibida' : 'Solicitud enviada'}
        </Badge>

        {isIncoming && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={onAccept}
              className="flex-1"
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="flex-1"
            >
              <UserX className="w-4 h-4 mr-1" />
              Rechazar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);