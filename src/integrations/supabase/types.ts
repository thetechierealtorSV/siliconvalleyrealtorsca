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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          role: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          role: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
      lead_notifications: {
        Row: {
          channel: string
          created_at: string
          detail: string | null
          id: string
          lead_id: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
          status: string
        }
        Update: {
          channel?: string
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          lead_type: Database["public"]["Enums"]["lead_type"]
          name: string | null
          payload: Json
          phone: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          source_page: string | null
          specialty: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          lead_type: Database["public"]["Enums"]["lead_type"]
          name?: string | null
          payload?: Json
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source_page?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          lead_type?: Database["public"]["Enums"]["lead_type"]
          name?: string | null
          payload?: Json
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source_page?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      offmarket_listings: {
        Row: {
          baths: number | null
          beds: number | null
          created_at: string
          display_order: number
          hero_image_url: string | null
          hidden_details: string | null
          id: string
          neighborhood: string
          price_band: string
          sqft: number | null
          status: string
          teaser_summary: string
          updated_at: string
        }
        Insert: {
          baths?: number | null
          beds?: number | null
          created_at?: string
          display_order?: number
          hero_image_url?: string | null
          hidden_details?: string | null
          id?: string
          neighborhood: string
          price_band: string
          sqft?: number | null
          status?: string
          teaser_summary: string
          updated_at?: string
        }
        Update: {
          baths?: number | null
          beds?: number | null
          created_at?: string
          display_order?: number
          hero_image_url?: string | null
          hidden_details?: string | null
          id?: string
          neighborhood?: string
          price_band?: string
          sqft?: number | null
          status?: string
          teaser_summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      offmarket_unlocks: {
        Row: {
          created_at: string
          email: string
          id: string
          listing_id: string | null
          name: string | null
          phone: string | null
          source_page: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          listing_id?: string | null
          name?: string | null
          phone?: string | null
          source_page?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          listing_id?: string | null
          name?: string | null
          phone?: string | null
          source_page?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offmarket_unlocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "offmarket_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offmarket_unlocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "offmarket_listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_on_price_drop: boolean
          created_at: string
          email: string
          filters: Json
          frequency: string
          id: string
          label: string | null
          name: string | null
          phone: string | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          alert_on_price_drop?: boolean
          created_at?: string
          email: string
          filters?: Json
          frequency?: string
          id?: string
          label?: string | null
          name?: string | null
          phone?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          alert_on_price_drop?: boolean
          created_at?: string
          email?: string
          filters?: Json
          frequency?: string
          id?: string
          label?: string | null
          name?: string | null
          phone?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      agent_profiles_public: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          full_name: string | null
          id: string | null
          photo_url: string | null
          role: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          role?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          role?: string | null
        }
        Relationships: []
      }
      offmarket_listings_public: {
        Row: {
          baths: number | null
          beds: number | null
          created_at: string | null
          display_order: number | null
          hero_image_url: string | null
          id: string | null
          neighborhood: string | null
          price_band: string | null
          sqft: number | null
          status: string | null
          teaser_summary: string | null
          updated_at: string | null
        }
        Insert: {
          baths?: number | null
          beds?: number | null
          created_at?: string | null
          display_order?: number | null
          hero_image_url?: string | null
          id?: string | null
          neighborhood?: string | null
          price_band?: string | null
          sqft?: number | null
          status?: string | null
          teaser_summary?: string | null
          updated_at?: string | null
        }
        Update: {
          baths?: number | null
          beds?: number | null
          created_at?: string | null
          display_order?: number | null
          hero_image_url?: string | null
          id?: string | null
          neighborhood?: string | null
          price_band?: string | null
          sqft?: number | null
          status?: string | null
          teaser_summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_priority: "hot" | "warm" | "cold"
      lead_status: "new" | "contacted" | "qualified" | "closed"
      lead_type:
        | "buyer_agreement"
        | "pre_approval"
        | "seller_listing"
        | "valuation"
        | "contact"
        | "chatbot"
        | "loan_referral"
        | "concierge"
        | "specialized_service"
        | "agent_recruit"
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
    Enums: {
      lead_priority: ["hot", "warm", "cold"],
      lead_status: ["new", "contacted", "qualified", "closed"],
      lead_type: [
        "buyer_agreement",
        "pre_approval",
        "seller_listing",
        "valuation",
        "contact",
        "chatbot",
        "loan_referral",
        "concierge",
        "specialized_service",
        "agent_recruit",
      ],
    },
  },
} as const
