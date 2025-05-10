export interface Database {
  public: {
    Tables: {
      novels: {
        Row: {
          id: string
          created_at: string | null
          title: string | null
          author: string | null
          description: string | null
          full_description: string | null
          image_url: string | null
          status: string | null
          category: string | null
          tags: string[] | null
          sample: string | null
          is_premium: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          title?: string | null
          author?: string | null
          description?: string | null
          full_description?: string | null
          image_url?: string | null
          status?: string | null
          category?: string | null
          tags?: string[] | null
          sample?: string | null
          is_premium?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string | null
          title?: string | null
          author?: string | null
          description?: string | null
          full_description?: string | null
          image_url?: string | null
          status?: string | null
          category?: string | null
          tags?: string[] | null
          sample?: string | null
          is_premium?: boolean | null
        }
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

export interface Novel {
  id: string;
  title: string;
  description: string;
  full_description: string | null;
  image_url: string | null;
  status: string;
  author: string;
  published_date: string | null;
  category: string;
  tags: string[] | null;
  sample: string | null;
  is_premium: boolean;
  created_at: string | null;
  epub_url: string | null; // إضافة حقل لعنوان ملف EPUB
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    [key: string]: any;
  };
  identities: any[];
  created_at: string;
  updated_at: string;
}
