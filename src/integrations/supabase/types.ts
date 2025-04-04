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
      admin_users: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      ator_atriz: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome?: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "ator_atriz_nome_fkey"
            columns: ["nome"]
            isOneToOne: false
            referencedRelation: "filme"
            referencedColumns: ["nome"]
          },
        ]
      }
      diretor: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id: string
          nome?: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "diretor_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "filme"
            referencedColumns: ["nome"]
          },
        ]
      }
      filme: {
        Row: {
          created_at: string
          gênero: string
          id: number
          nome: string
        }
        Insert: {
          created_at?: string
          gênero?: string
          id?: number
          nome?: string
        }
        Update: {
          created_at?: string
          gênero?: string
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "filme_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "streaming"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          movie_id: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          movie_id: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          movie_id?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_comments_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_ratings: {
        Row: {
          created_at: string
          id: string
          movie_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movie_ratings_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          created_at: string
          director: string | null
          duration: number | null
          genre: string | null
          id: string
          imdb_rating: number | null
          language: string | null
          poster_url: string | null
          rating: string | null
          registered_by: string | null
          release_date: string | null
          synopsis: string | null
          title: string
          trailer_url: string | null
        }
        Insert: {
          created_at?: string
          director?: string | null
          duration?: number | null
          genre?: string | null
          id?: string
          imdb_rating?: number | null
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          registered_by?: string | null
          release_date?: string | null
          synopsis?: string | null
          title: string
          trailer_url?: string | null
        }
        Update: {
          created_at?: string
          director?: string | null
          duration?: number | null
          genre?: string | null
          id?: string
          imdb_rating?: number | null
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          registered_by?: string | null
          release_date?: string | null
          synopsis?: string | null
          title?: string
          trailer_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      streaming: {
        Row: {
          disponibilidade: boolean
          id: number
          servico: string
        }
        Insert: {
          disponibilidade: boolean
          id?: number
          servico?: string
        }
        Update: {
          disponibilidade?: boolean
          id?: number
          servico?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
