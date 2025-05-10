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
          allow_download: boolean | null
          epub_url: string | null  // Add the epub_url field here
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
          allow_download?: boolean | null
          epub_url?: string | null  // Add the epub_url field here
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
          allow_download?: boolean | null
          epub_url?: string | null  // Add the epub_url field here
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
  status: 'published' | 'draft';
  author: string;
  published_date: string | null;
  category: string;
  tags: string[] | null;
  sample: string | null;
  is_premium: boolean;
  allow_download: boolean;
  created_at: string | null;
  epub_url: string | null;  // Add the epub_url field here
}

export interface Chapter {
  id: string;
  novel_id: string;
  title: string;
  content: string;
  order: number;
  status: 'published' | 'draft';
  created_at: string | null;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  site_description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  created_at: string | null;
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
