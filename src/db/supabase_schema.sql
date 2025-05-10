
-- جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL,
  site_description TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  facebook TEXT,
  twitter TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء تسجيلة افتراضية للإعدادات
INSERT INTO public.website_settings (site_name, site_description, primary_color, secondary_color)
VALUES ('محراب التوبة', 'منصة روايات إسلامية', '#5A67D8', '#4C51BF')
ON CONFLICT DO NOTHING;

-- جدول الروايات
CREATE TABLE IF NOT EXISTS public.novels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  allow_download BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
  sample TEXT,
  epub_url TEXT
);

-- إضافة مؤشر للبحث على عنوان الرواية
CREATE INDEX IF NOT EXISTS novels_title_idx ON public.novels USING GIN (to_tsvector('arabic', title));
-- إضافة مؤشر للتصفية حسب الحالة
CREATE INDEX IF NOT EXISTS novels_status_idx ON public.novels (status);
-- إضافة مؤشر للتصفية حسب التصنيف
CREATE INDEX IF NOT EXISTS novels_category_idx ON public.novels (category);

-- جدول فصول الروايات
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  status TEXT CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة مؤشر للعلاقة بين الفصول والروايات
CREATE INDEX IF NOT EXISTS chapters_novel_id_idx ON public.chapters (novel_id);
-- إضافة مؤشر للتصفية حسب الحالة
CREATE INDEX IF NOT EXISTS chapters_status_idx ON public.chapters (status);
-- إضافة مؤشر للترتيب
CREATE INDEX IF NOT EXISTS chapters_order_idx ON public.chapters ("order");

-- إنشاء قواعد أمنية لتقييد الوصول (RLS)
-- تفعيل قواعد الأمن للجداول
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- سماح بالقراءة العامة للروايات المنشورة
CREATE POLICY "الروايات المنشورة مسموحة للقراءة العامة" 
ON public.novels FOR SELECT 
USING (status = 'published');

-- سماح بالقراءة العامة للفصول المنشورة للروايات المنشورة
CREATE POLICY "الفصول المنشورة مسموحة للقراءة العامة" 
ON public.chapters FOR SELECT 
USING (
  status = 'published' AND 
  EXISTS (
    SELECT 1 FROM public.novels 
    WHERE novels.id = chapters.novel_id AND novels.status = 'published'
  )
);

-- سماح بالقراءة العامة لإعدادات الموقع
CREATE POLICY "إعدادات الموقع مسموحة للقراءة العامة" 
ON public.website_settings FOR SELECT 
USING (true);
