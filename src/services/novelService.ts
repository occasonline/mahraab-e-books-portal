
import { supabase } from '@/lib/supabase';
import { Novel } from '@/types/supabase';
import { NovelFormValues } from '@/schemas/novelSchema';

// استرجاع جميع الروايات
export const getNovels = async () => {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('خطأ في استرجاع الروايات:', error);
    throw error;
  }
  
  return data as Novel[];
};

// استرجاع رواية واحدة بواسطة المعرف
export const getNovelById = async (id: string) => {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`خطأ في استرجاع الرواية بالمعرف ${id}:`, error);
    throw error;
  }
  
  return data as Novel;
};

// إنشاء رواية جديدة
export const createNovel = async (novelData: NovelFormValues) => {
  // تحويل بيانات النموذج إلى صيغة قاعدة البيانات
  const dbNovel = {
    title: novelData.title,
    author: novelData.author,
    description: novelData.description,
    full_description: novelData.fullDescription,
    category: novelData.category,
    image_url: novelData.imageUrl,
    tags: novelData.tags,
    is_premium: novelData.isPremium,
    allow_download: novelData.allowDownload,
    status: novelData.status,
    sample: novelData.sample,
  };
  
  const { data, error } = await supabase
    .from('novels')
    .insert([dbNovel])
    .select();
  
  if (error) {
    console.error('خطأ في إنشاء الرواية:', error);
    throw error;
  }
  
  return data[0] as Novel;
};

// تحديث رواية موجودة
export const updateNovel = async (id: string, novelData: NovelFormValues) => {
  // تحويل بيانات النموذج إلى صيغة قاعدة البيانات
  const dbNovel = {
    title: novelData.title,
    author: novelData.author,
    description: novelData.description,
    full_description: novelData.fullDescription,
    category: novelData.category,
    image_url: novelData.imageUrl,
    tags: novelData.tags,
    is_premium: novelData.isPremium,
    allow_download: novelData.allowDownload,
    status: novelData.status,
    sample: novelData.sample,
  };
  
  const { data, error } = await supabase
    .from('novels')
    .update(dbNovel)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`خطأ في تحديث الرواية بالمعرف ${id}:`, error);
    throw error;
  }
  
  return data[0] as Novel;
};

// حذف رواية
export const deleteNovel = async (id: string) => {
  // حذف الفصول المرتبطة بالرواية أولاً
  const { error: chaptersError } = await supabase
    .from('chapters')
    .delete()
    .eq('novel_id', id);
  
  if (chaptersError) {
    console.error(`خطأ في حذف الفصول للرواية ${id}:`, chaptersError);
    throw chaptersError;
  }
  
  // ثم حذف الرواية نفسها
  const { error } = await supabase
    .from('novels')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`خطأ في حذف الرواية بالمعرف ${id}:`, error);
    throw error;
  }
  
  return true;
};

// تغيير حالة الرواية (منشورة أو مسودة)
export const updateNovelStatus = async (id: string, status: 'published' | 'draft') => {
  const { data, error } = await supabase
    .from('novels')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`خطأ في تحديث حالة الرواية ${id}:`, error);
    throw error;
  }
  
  return data[0] as Novel;
};
