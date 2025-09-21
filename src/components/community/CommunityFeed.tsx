import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useCommunity } from '@/hooks/useCommunity';
import { Search, Filter, TrendingUp, Clock, Heart } from 'lucide-react';

export const CommunityFeed: React.FC = () => {
  const { posts, loading, fetchPosts } = useCommunity();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'general', label: 'General' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'certificaciones', label: 'Certificaciones' },
    { value: 'networking', label: 'Networking' },
    { value: 'empleo', label: 'Empleo' },
    { value: 'recursos', label: 'Recursos' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Más recientes', icon: Clock },
    { value: 'popular', label: 'Más populares', icon: TrendingUp },
    { value: 'liked', label: 'Más me gusta', icon: Heart }
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchPosts(category === 'all' ? undefined : category);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count);
      case 'liked':
        return b.likes_count - a.likes_count;
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-48"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
        
        {/* Posts Skeleton */}
        {[1, 2, 3].map(i => (
          <div key={i} className="card-elegant p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Comunidad</h2>
          <p className="text-muted-foreground">
            Conecta, aprende y comparte con profesionales como tú
          </p>
        </div>
        <CreatePostModal />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            {(() => {
              const option = sortOptions.find(opt => opt.value === sortBy);
              const Icon = option?.icon || Clock;
              return <Icon className="w-4 h-4 mr-2" />;
            })()}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              onCommentAdded={() => fetchPosts(selectedCategory === 'all' ? undefined : selectedCategory)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No se encontraron posts' : 'No hay posts aún'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Sé el primero en compartir algo con la comunidad'
              }
            </p>
            {!searchQuery && <CreatePostModal />}
          </div>
        )}
      </div>

      {/* Load More */}
      {sortedPosts.length > 0 && sortedPosts.length % 20 === 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => fetchPosts(selectedCategory === 'all' ? undefined : selectedCategory, posts.length + 20)}
          >
            Cargar más posts
          </Button>
        </div>
      )}
    </div>
  );
};