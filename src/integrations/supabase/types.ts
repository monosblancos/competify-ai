export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount_cents: number
          created_at: string
          currency: string
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_cents: number
          commission_rate: number
          confirmed_at: string | null
          created_at: string
          id: string
          order_id: string | null
          paid_at: string | null
          referral_code: string
          referred_user_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_cents?: number
          commission_rate: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          paid_at?: string | null
          referral_code: string
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_cents?: number
          commission_rate?: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          paid_at?: string | null
          referral_code?: string
          referred_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "resource_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          approved_at: string | null
          approved_by: string | null
          commission_rate: number
          created_at: string
          id: string
          status: string
          total_earnings_cents: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          total_earnings_cents?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          total_earnings_cents?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_data: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_data?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_data?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          category: string
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          required_standards: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          id: string
          location?: string | null
          required_standards?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          required_standards?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_access: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "resource_products"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_assets: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          kind: string
          product_id: string
          size_mb: number | null
          sort_order: number | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          kind: string
          product_id: string
          size_mb?: number | null
          sort_order?: number | null
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          kind?: string
          product_id?: string
          size_mb?: number | null
          sort_order?: number | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_assets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "resource_products"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_bundle_items: {
        Row: {
          bundle_id: string
          product_id: string
          quantity: number | null
        }
        Insert: {
          bundle_id: string
          product_id: string
          quantity?: number | null
        }
        Update: {
          bundle_id?: string
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "resource_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "resource_products"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_pct: number
          expires_at: string | null
          max_uses: number | null
          used_count: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_pct: number
          expires_at?: string | null
          max_uses?: number | null
          used_count?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_pct?: number
          expires_at?: string | null
          max_uses?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      resource_offer_interactions: {
        Row: {
          action: string
          coupon_generated: string | null
          created_at: string | null
          offer_id: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          coupon_generated?: string | null
          created_at?: string | null
          offer_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          coupon_generated?: string | null
          created_at?: string | null
          offer_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_offer_interactions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "resource_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_offers: {
        Row: {
          active: boolean | null
          content: Json
          cooldown_hours: number | null
          created_at: string | null
          discount_pct: number | null
          expires_hours: number | null
          id: string
          max_shows_per_user: number | null
          name: string
          target_segment: string | null
          trigger_event: string | null
          type: string
        }
        Insert: {
          active?: boolean | null
          content: Json
          cooldown_hours?: number | null
          created_at?: string | null
          discount_pct?: number | null
          expires_hours?: number | null
          id?: string
          max_shows_per_user?: number | null
          name: string
          target_segment?: string | null
          trigger_event?: string | null
          type: string
        }
        Update: {
          active?: boolean | null
          content?: Json
          cooldown_hours?: number | null
          created_at?: string | null
          discount_pct?: number | null
          expires_hours?: number | null
          id?: string
          max_shows_per_user?: number | null
          name?: string
          target_segment?: string | null
          trigger_event?: string | null
          type?: string
        }
        Relationships: []
      }
      resource_order_items: {
        Row: {
          order_id: string
          price_cents: number
          product_id: string
          quantity: number | null
        }
        Insert: {
          order_id: string
          price_cents: number
          product_id: string
          quantity?: number | null
        }
        Update: {
          order_id?: string
          price_cents?: number
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "resource_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "resource_products"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_orders: {
        Row: {
          amount_cents: number
          coupon_code: string | null
          created_at: string | null
          currency: string
          discount_cents: number | null
          id: string
          provider: string
          provider_payment_id: string | null
          provider_session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          utm: Json | null
        }
        Insert: {
          amount_cents: number
          coupon_code?: string | null
          created_at?: string | null
          currency?: string
          discount_cents?: number | null
          id?: string
          provider: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm?: Json | null
        }
        Update: {
          amount_cents?: number
          coupon_code?: string | null
          created_at?: string | null
          currency?: string
          discount_cents?: number | null
          id?: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm?: Json | null
        }
        Relationships: []
      }
      resource_products: {
        Row: {
          bonuses: Json | null
          cover_url: string | null
          created_at: string | null
          currency: string
          curriculum: Json | null
          description: string | null
          duration: string | null
          faq: Json | null
          guarantee_days: number | null
          hero_media_url: string | null
          id: string
          instructor: string | null
          is_free: boolean | null
          level: string | null
          outcomes: Json | null
          price_cents: number
          published: boolean | null
          rating: number | null
          sector: string | null
          seo: Json | null
          slug: string
          standards: string[] | null
          subtitle: string | null
          target_audience: Json | null
          testimonials: Json | null
          title: string
          total_purchases: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          bonuses?: Json | null
          cover_url?: string | null
          created_at?: string | null
          currency?: string
          curriculum?: Json | null
          description?: string | null
          duration?: string | null
          faq?: Json | null
          guarantee_days?: number | null
          hero_media_url?: string | null
          id?: string
          instructor?: string | null
          is_free?: boolean | null
          level?: string | null
          outcomes?: Json | null
          price_cents: number
          published?: boolean | null
          rating?: number | null
          sector?: string | null
          seo?: Json | null
          slug: string
          standards?: string[] | null
          subtitle?: string | null
          target_audience?: Json | null
          testimonials?: Json | null
          title: string
          total_purchases?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          bonuses?: Json | null
          cover_url?: string | null
          created_at?: string | null
          currency?: string
          curriculum?: Json | null
          description?: string | null
          duration?: string | null
          faq?: Json | null
          guarantee_days?: number | null
          hero_media_url?: string | null
          id?: string
          instructor?: string | null
          is_free?: boolean | null
          level?: string | null
          outcomes?: Json | null
          price_cents?: number
          published?: boolean | null
          rating?: number | null
          sector?: string | null
          seo?: Json | null
          slug?: string
          standards?: string[] | null
          subtitle?: string | null
          target_audience?: Json | null
          testimonials?: Json | null
          title?: string
          total_purchases?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      standards: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          description: string | null
          embedding: string | null
          is_core_offering: boolean | null
          modules: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          is_core_offering?: boolean | null
          modules?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          is_core_offering?: boolean | null
          modules?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          cv_url: string | null
          education_level: string | null
          email: string | null
          experiences: Json | null
          full_name: string | null
          id: string
          last_analysis_result: Json | null
          objectives: string | null
          phone: string | null
          progress: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cv_url?: string | null
          education_level?: string | null
          email?: string | null
          experiences?: Json | null
          full_name?: string | null
          id: string
          last_analysis_result?: Json | null
          objectives?: string | null
          phone?: string | null
          progress?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cv_url?: string | null
          education_level?: string | null
          email?: string | null
          experiences?: Json | null
          full_name?: string | null
          id?: string
          last_analysis_result?: Json | null
          objectives?: string | null
          phone?: string | null
          progress?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_affiliate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search_standards_by_similarity: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          code: string
          description: string
          similarity: number
          title: string
        }[]
      }
      search_standards_by_text: {
        Args: { match_count?: number; search_query: string }
        Returns: {
          category: string
          code: string
          description: string
          title: string
        }[]
      }
      validate_coupon_code: {
        Args: { coupon_code_input: string }
        Returns: {
          active: boolean
          code: string
          discount_pct: number
          expires_at: string
          max_uses: number
          used_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
