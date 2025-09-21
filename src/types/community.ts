export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: {
    full_name: string;
    email: string;
  };
  is_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: {
    full_name: string;
    email: string;
  };
  is_liked?: boolean;
  replies?: CommunityComment[];
}

export interface UserConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Joined data
  requester_profile?: {
    full_name: string;
    email: string;
  };
  addressee_profile?: {
    full_name: string;
    email: string;
  };
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  creator_id: string;
  is_private: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  creator_profile?: {
    full_name: string;
    email: string;
  };
  is_member?: boolean;
  user_role?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  // Joined data
  user_profile?: {
    full_name: string;
    email: string;
  };
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  sender_profile?: {
    full_name: string;
    email: string;
  };
  recipient_profile?: {
    full_name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  education_level?: string;
  objectives?: string;
  experiences?: any[];
  progress?: any;
  // Additional community fields
  connection_status?: 'none' | 'pending' | 'connected';
  mutual_connections?: number;
}

export interface CommunityStats {
  totalPosts: number;
  totalMembers: number;
  totalGroups: number;
  myConnections: number;
  unreadMessages: number;
}