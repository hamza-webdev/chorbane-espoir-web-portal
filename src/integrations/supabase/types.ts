export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          season: string | null
          start_date: string | null
          type: Database["public"]["Enums"]["competition_type"]
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          season?: string | null
          start_date?: string | null
          type: Database["public"]["Enums"]["competition_type"]
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          season?: string | null
          start_date?: string | null
          type?: Database["public"]["Enums"]["competition_type"]
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          donor_phone: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          payment_method: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      galleries: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          competition_id: string | null
          created_at: string
          id: string
          is_home: boolean | null
          match_date: string
          notes: string | null
          opponent_score: number | null
          opponent_team: string
          our_score: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          competition_id?: string | null
          created_at?: string
          id?: string
          is_home?: boolean | null
          match_date: string
          notes?: string | null
          opponent_score?: number | null
          opponent_team: string
          our_score?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          competition_id?: string | null
          created_at?: string
          id?: string
          is_home?: boolean | null
          match_date?: string
          notes?: string | null
          opponent_score?: number | null
          opponent_team?: string
          our_score?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string
          gallery_id: string | null
          id: string
          image_url: string
          order_index: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_id?: string | null
          id?: string
          image_url: string
          order_index?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_id?: string | null
          id?: string
          image_url?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          active: boolean | null
          age: number | null
          bio: string | null
          created_at: string
          height: number | null
          id: string
          jersey_number: number | null
          joined_date: string | null
          name: string
          photo: string | null
          position: Database["public"]["Enums"]["player_position"]
          updated_at: string
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          age?: number | null
          bio?: string | null
          created_at?: string
          height?: number | null
          id?: string
          jersey_number?: number | null
          joined_date?: string | null
          name: string
          photo?: string | null
          position: Database["public"]["Enums"]["player_position"]
          updated_at?: string
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          age?: number | null
          bio?: string | null
          created_at?: string
          height?: number | null
          id?: string
          jersey_number?: number | null
          joined_date?: string | null
          name?: string
          photo?: string | null
          position?: Database["public"]["Enums"]["player_position"]
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          joined_date: string | null
          name: string
          phone: string | null
          photo: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          joined_date?: string | null
          name: string
          phone?: string | null
          photo?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          joined_date?: string | null
          name?: string
          phone?: string | null
          photo?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_reactions: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          expires_at: string
          id: string
          reaction_type: string
          user_ip: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          expires_at?: string
          id?: string
          reaction_type: string
          user_ip: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          expires_at?: string
          id?: string
          reaction_type?: string
          user_ip?: string
        }
        Relationships: []
      }
    }
    Views: {
      reaction_counts: {
        Row: {
          dislikes_count: number | null
          entity_id: string | null
          entity_type: string | null
          likes_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_reactions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      competition_type: "championnat" | "coupe" | "amical" | "autre"
      match_status: "a_venir" | "en_cours" | "termine" | "reporte"
      player_position: "gardien" | "defenseur" | "milieu" | "attaquant"
      staff_role:
        | "entraineur"
        | "entraineur_adjoint"
        | "preparateur_physique"
        | "medecin"
        | "manager"
        | "autre"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      competition_type: ["championnat", "coupe", "amical", "autre"],
      match_status: ["a_venir", "en_cours", "termine", "reporte"],
      player_position: ["gardien", "defenseur", "milieu", "attaquant"],
      staff_role: [
        "entraineur",
        "entraineur_adjoint",
        "preparateur_physique",
        "medecin",
        "manager",
        "autre",
      ],
    },
  },
} as const
