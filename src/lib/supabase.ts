
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// في Lovable، بيانات الاتصال بـ Supabase تكون متاحة في window.ENV بعد ربط المشروع بـ Supabase
const ENV = (window as any).ENV || {};
const supabaseUrl = ENV.VITE_SUPABASE_URL;
const supabaseKey = ENV.VITE_SUPABASE_ANON_KEY;

// فحص توفر بيانات الاتصال
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

// طباعة رسالة خطأ في حالة عدم توفر بيانات الاتصال
if (!isSupabaseConfigured()) {
  console.error('خطأ: متغيرات البيئة لـ Supabase غير متوفرة. تأكد من تفعيل اتصال Supabase من لوحة التحكم.');
}

// إنشاء عميل Supabase
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseKey || 'placeholder-key'
);

// تصدير نوع البيانات من مكتبة supabase
export type { User } from '@supabase/supabase-js';
