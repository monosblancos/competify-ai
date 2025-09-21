import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserConnection, UserProfile, DirectMessage } from '@/types/community';
import { toast } from 'sonner';

export const useNetworking = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationUser, setConversationUser] = useState<string | null>(null);

  // Fetch connections
  const fetchConnections = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          requester_profiles:user_profiles!user_connections_requester_id_fkey (
            id,
            full_name,
            email,
            education_level
          ),
          addressee_profiles:user_profiles!user_connections_addressee_id_fkey (
            id,
            full_name,
            email,
            education_level
          )
        `)
        .or(`requester_id.eq.${(user as any)?.id},addressee_id.eq.${(user as any)?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const connectionsWithProfiles = data?.map(conn => ({
        ...conn,
        requester_profile: conn.requester_profiles?.[0] || { full_name: '', email: '' },
        addressee_profile: conn.addressee_profiles?.[0] || { full_name: '', email: '' }
      })) || [];

      setConnections(connectionsWithProfiles);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Error al cargar conexiones');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch suggested users (users with similar objectives/education)
  const fetchSuggestedUsers = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, education_level, objectives, experiences')
        .neq('id', (user as any)?.id)
        .limit(10);

      if (error) throw error;

      // Filter out users already connected
      const connectedUserIds = connections.map(conn => 
        conn.requester_id === (user as any)?.id ? conn.addressee_id : conn.requester_id
      );

      const suggestions = data?.filter(profile => 
        !connectedUserIds.includes(profile.id)
      ).map(profile => ({
        ...profile,
        connection_status: 'none' as const,
        mutual_connections: 0,
        experiences: profile.experiences as any[] || []
      })) || [];

      setSuggestedUsers(suggestions);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  }, [user, connections]);

  // Send connection request
  const sendConnectionRequest = useCallback(async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_connections')
        .insert([{
          requester_id: (user as any)?.id,
          addressee_id: userId,
          status: 'pending'
        }]);

      if (error) throw error;

      // Update suggested users to show pending status
      setSuggestedUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, connection_status: 'pending' }
          : u
      ));

      toast.success('Solicitud de conexión enviada');
      fetchConnections();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Error al enviar solicitud');
    }
  }, [user, fetchConnections]);

  // Respond to connection request
  const respondToConnection = useCallback(async (connectionId: string, status: 'accepted' | 'rejected') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status })
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(
        status === 'accepted' 
          ? 'Conexión aceptada' 
          : 'Solicitud rechazada'
      );

      fetchConnections();
    } catch (error) {
      console.error('Error responding to connection:', error);
      toast.error('Error al procesar la respuesta');
    }
  }, [user, fetchConnections]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender_profiles:user_profiles!direct_messages_sender_id_fkey (
            full_name,
            email
          ),
          recipient_profiles:user_profiles!direct_messages_recipient_id_fkey (
            full_name,
            email
          )
        `)
        .or(`and(sender_id.eq.${(user as any)?.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${(user as any)?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithProfiles = data?.map(msg => ({
        ...msg,
        sender_profile: msg.sender_profiles?.[0] || { full_name: '', email: '' },
        recipient_profile: msg.recipient_profiles?.[0] || { full_name: '', email: '' }
      })) || [];

      setMessages(messagesWithProfiles);
      setConversationUser(otherUserId);

      // Mark messages as read
      const unreadMessages = messagesWithProfiles.filter(
        msg => msg.recipient_id === (user as any)?.id && !msg.is_read
      );

      if (unreadMessages.length > 0) {
        await supabase
          .from('direct_messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(msg => msg.id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error al cargar mensajes');
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: (user as any)?.id,
          recipient_id: recipientId,
          content
        }])
        .select(`
          *,
          sender_profiles:user_profiles!direct_messages_sender_id_fkey (
            full_name,
            email
          ),
          recipient_profiles:user_profiles!direct_messages_recipient_id_fkey (
            full_name,
            email
          )
        `)
        .single();

      if (error) throw error;

      const newMessage = {
        ...data,
        sender_profile: data.sender_profiles?.[0] || { full_name: '', email: '' },
        recipient_profile: data.recipient_profiles?.[0] || { full_name: '', email: '' }
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    }
  }, [user]);

  // Get conversation list
  const getConversations = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender_profiles:user_profiles!direct_messages_sender_id_fkey (
            id,
            full_name,
            email
          ),
          recipient_profiles:user_profiles!direct_messages_recipient_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .or(`sender_id.eq.${(user as any)?.id},recipient_id.eq.${(user as any)?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationMap = new Map();
      
      data?.forEach(msg => {
        const partnerId = msg.sender_id === (user as any)?.id ? msg.recipient_id : msg.sender_id;
        const partnerProfile = msg.sender_id === (user as any)?.id ? msg.recipient_profiles?.[0] : msg.sender_profiles?.[0];
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            userId: partnerId,
            userProfile: partnerProfile,
            lastMessage: msg,
            unreadCount: 0
          });
        }

        // Count unread messages
        if (msg.recipient_id === (user as any)?.id && !msg.is_read) {
          conversationMap.get(partnerId).unreadCount++;
        }
      });

      return Array.from(conversationMap.values());
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const connectionsChannel = supabase
      .channel('user-connections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_connections'
        },
        () => {
          fetchConnections();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('direct-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          // Only update if it's for current conversation
          if (conversationUser && 
              (payload.new.sender_id === conversationUser || 
               payload.new.recipient_id === conversationUser)) {
            fetchMessages(conversationUser);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connectionsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, fetchConnections, fetchMessages, conversationUser]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user, fetchConnections]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return {
    connections,
    suggestedUsers,
    messages,
    loading,
    conversationUser,
    fetchConnections,
    sendConnectionRequest,
    respondToConnection,
    fetchMessages,
    sendMessage,
    getConversations
  };
};