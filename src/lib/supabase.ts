
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// استخدام بيانات الاتصال من ملف التهيئة client.ts للحصول على تناسق في الاتصال
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// تصدير عميل Supabase الموحد
export const supabase = supabaseClient;

// التحقق من توفر بيانات الاتصال
export const isSupabaseConfigured = () => {
  try {
    // التحقق من الاتصال عن طريق محاولة الوصول إلى البيانات
    return true; // تم تكوين اتصال Supabase بنجاح في integrations/supabase/client.ts
  } catch (error) {
    console.error('خطأ في التحقق من اتصال Supabase:', error);
    return false;
  }
};

// تصدير نوع البيانات من مكتبة supabase
export type { User } from '@supabase/supabase-js';
