import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityPost, CommunityComment, CommunityStats } from '@/types/community';
import { toast } from 'sonner';

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalMembers: 0,
    totalGroups: 0,
    myConnections: 0,
    unreadMessages: 0,
  });

  // Fetch posts with user profiles and like status
  const fetchPosts = useCallback(async (category?: string, limit = 20) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user_profiles!community_posts_user_id_fkey (
            full_name,
            email
          ),
          post_likes!left (
            user_id
          )
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      const postsWithLikes = data?.map(post => ({
        ...post,
        user_profile: post.user_profiles?.[0] || { full_name: '', email: '' },
        is_liked: post.post_likes?.some(like => like.user_id === (user as any)?.id) || false
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new post
  const createPost = useCallback(async (postData: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
        user_id: (user as any)?.id,
          tags: postData.tags || []
        }])
        .select(`
          *,
          user_profiles!community_posts_user_id_fkey (
            full_name,
            email
          )
        `)
        .single();

      if (error) throw error;

      const newPost = {
        ...data,
        user_profile: data.user_profiles?.[0] || { full_name: '', email: '' },
        is_liked: false
      };

      setPosts(prev => [newPost, ...prev]);
      toast.success('Post creado exitosamente');
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear el post');
      return null;
    }
  }, [user]);

  // Toggle like on post
  const togglePostLike = useCallback(async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.is_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', (user as any)?.id);

        if (error) throw error;

        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, is_liked: false, likes_count: p.likes_count - 1 }
            : p
        ));
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: (user as any)?.id
          }]);

        if (error) throw error;

        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, is_liked: true, likes_count: p.likes_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling post like:', error);
      toast.error('Error al procesar la acción');
    }
  }, [user, posts]);

  // Fetch comments for a post
  const fetchComments = useCallback(async (postId: string): Promise<CommunityComment[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          user_profiles!community_comments_user_id_fkey (
            full_name,
            email
          ),
          comment_likes!left (
            user_id
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(comment => ({
        ...comment,
        user_profile: comment.user_profiles?.[0] || { full_name: '', email: '' },
        is_liked: comment.comment_likes?.some(like => like.user_id === (user as any)?.id) || false
      })) || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }, [user]);

  // Create comment
  const createComment = useCallback(async (postId: string, content: string, parentCommentId?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert([{
          post_id: postId,
          user_id: (user as any)?.id,
          content,
          parent_comment_id: parentCommentId
        }])
        .select(`
          *,
          user_profiles!community_comments_user_id_fkey (
            full_name,
            email
          )
        `)
        .single();

      if (error) throw error;

      const newComment = {
        ...data,
        user_profile: data.user_profiles?.[0] || { full_name: '', email: '' },
        is_liked: false
      };

      // Update comments count in posts
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      ));

      toast.success('Comentario agregado');
      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Error al crear el comentario');
      return null;
    }
  }, [user]);

  // Fetch community stats
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      const [postsCount, groupsCount, connectionsCount, unreadCount] = await Promise.all([
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('community_groups').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_connections')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'accepted')
          .or(`requester_id.eq.${(user as any)?.id},addressee_id.eq.${(user as any)?.id}`),
        supabase
          .from('direct_messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', (user as any)?.id)
          .eq('is_read', false)
      ]);

      setStats({
        totalPosts: postsCount.count || 0,
        totalMembers: 0, // Would need auth.users count from admin API
        totalGroups: groupsCount.count || 0,
        myConnections: connectionsCount.count || 0,
        unreadMessages: unreadCount.count || 0,
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const postsChannel = supabase
      .channel('community-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    const likesChannel = supabase
      .channel('post-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [user, fetchPosts]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchStats();
    }
  }, [user, fetchPosts, fetchStats]);

  return {
    posts,
    loading,
    stats,
    fetchPosts,
    createPost,
    togglePostLike,
    fetchComments,
    createComment,
    fetchStats
  };
};