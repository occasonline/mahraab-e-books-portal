
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: string
          novel_id: string
          title: string
          content: string
          order: number
          status: 'published' | 'draft'
          created_at: string
        }
        Insert: {
          id?: string
          novel_id: string
          title: string
          content: string
          order: number
          status?: 'published' | 'draft'
          created_at?: string
        }
        Update: {
          id?: string
          novel_id?: string
          title?: string
          content?: string
          order?: number
          status?: 'published' | 'draft'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            referencedRelation: "novels"
            referencedColumns: ["id"]
          }
        ]
      }
      novels: {
        Row: {
          id: string
          created_at: string
          title: string
          author: string
          description: string
          full_description: string
          category: string
          image_url: string | null
          tags: string[]
          is_premium: boolean
          allow_download: boolean
          status: 'published' | 'draft'
          sample: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          author: string
          description: string
          full_description: string
          category: string
          image_url?: string | null
          tags?: string[]
          is_premium?: boolean
          allow_download?: boolean
          status?: 'published' | 'draft'
          sample: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          author?: string
          description?: string
          full_description?: string
          category?: string
          image_url?: string | null
          tags?: string[]
          is_premium?: boolean
          allow_download?: boolean
          status?: 'published' | 'draft'
          sample?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          id: string
          site_name: string
          site_description: string | null
          primary_color: string | null
          secondary_color: string | null
          email: string | null
          phone: string | null
          address: string | null
          facebook: string | null
          twitter: string | null
          instagram: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_name: string
          site_description?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          facebook?: string | null
          twitter?: string | null
          instagram?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          site_name?: string
          site_description?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          facebook?: string | null
          twitter?: string | null
          instagram?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
