
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// إنشاء عميل Supabase باستخدام متغيرات البيئة التي توفرها Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// إنشاء عميل Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// تصدير نوع البيانات من مكتبة supabase
export type { User } from '@supabase/supabase-js';
