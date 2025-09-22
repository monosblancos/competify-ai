import React, { useState } from 'react';
import { CommunityPost, CommunityComment } from '@/types/community';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Heart, MessageCircle, Share, Pin, User, Calendar } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: CommunityPost;
  showComments?: boolean;
  onCommentAdded?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  showComments = false,
  onCommentAdded 
}) => {
  const { user } = useAuth();
  const { togglePostLike, fetchComments, createComment } = useCommunity();
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [showCommentSection, setShowCommentSection] = useState(showComments);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    await togglePostLike(post.id);
  };

  const handleShowComments = async () => {
    if (!showCommentSection) {
      setLoadingComments(true);
      const commentsData = await fetchComments(post.id);
      setComments(commentsData);
      setLoadingComments(false);
    }
    setShowCommentSection(!showCommentSection);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    const comment = await createComment(post.id, newComment.trim());
    if (comment) {
      setComments(prev => [...prev, comment as CommunityComment]);
      setNewComment('');
      onCommentAdded?.();
    }
    setSubmittingComment(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'general': 'bg-muted text-muted-foreground',
      'tecnologia': 'bg-blue-100 text-blue-700',
      'certificaciones': 'bg-green-100 text-green-700',
      'networking': 'bg-purple-100 text-purple-700',
      'empleo': 'bg-orange-100 text-orange-700',
      'recursos': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">
                  {post.user_profile?.full_name || 'Usuario'}
                </h4>
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-accent" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true,
                    locale: es 
                  })}
                </span>
              </div>
            </div>
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Title */}
        <h3 className="text-lg font-semibold text-foreground">
          {post.title}
        </h3>

        {/* Post Content */}
        <div className="text-muted-foreground">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                post.is_liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowComments}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Share className="w-4 h-4" />
              <span>Compartir</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showCommentSection && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Add Comment */}
            {user && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submittingComment}
                    size="sm"
                  >
                    {submittingComment ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">
                          {comment.user_profile?.full_name || 'Usuario'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true,
                            locale: es 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-muted-foreground"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likes_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-muted-foreground"
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};