
export interface Novel {
  id: string;
  created_at: string;
  title: string;
  author: string;
  description: string;
  full_description: string;
  category: string;
  image_url: string;
  tags: string[];
  is_premium: boolean;
  allow_download: boolean;
  status: 'published' | 'draft';
  sample: string;
}

export interface Chapter {
  id: string;
  novel_id: string;
  title: string;
  content: string;
  order: number;
  status: 'published' | 'draft';
  created_at: string;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
}
