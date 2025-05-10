
import { supabase } from '@/lib/supabase';
import { Chapter } from '@/types/supabase';

// استرجاع فصول رواية معينة
export const getChaptersByNovelId = async (novelId: string) => {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .order('order', { ascending: true });
  
  if (error) {
    console.error(`خطأ في استرجاع فصول الرواية ${novelId}:`, error);
    throw error;
  }
  
  return data as Chapter[];
};

// استرجاع فصل واحد بواسطة المعرف
export const getChapterById = async (id: string) => {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`خطأ في استرجاع الفصل بالمعرف ${id}:`, error);
    throw error;
  }
  
  return data as Chapter;
};

// إنشاء فصل جديد
export const createChapter = async (chapterData: Omit<Chapter, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('chapters')
    .insert([chapterData] as any)
    .select();
  
  if (error) {
    console.error('خطأ في إنشاء الفصل:', error);
    throw error;
  }
  
  return data[0] as Chapter;
};

// تحديث فصل موجود
export const updateChapter = async (
  id: string, 
  chapterData: Pick<Chapter, 'title' | 'content' | 'status' | 'order'>
) => {
  const { data, error } = await supabase
    .from('chapters')
    .update(chapterData as any)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`خطأ في تحديث الفصل بالمعرف ${id}:`, error);
    throw error;
  }
  
  return data[0] as Chapter;
};

// حذف فصل
export const deleteChapter = async (id: string) => {
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`خطأ في حذف الفصل بالمعرف ${id}:`, error);
    throw error;
  }
  
  return true;
};

// تغيير حالة الفصل (منشور أو مسودة)
export const updateChapterStatus = async (id: string, status: 'published' | 'draft') => {
  const { data, error } = await supabase
    .from('chapters')
    .update({ status } as any)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`خطأ في تحديث حالة الفصل ${id}:`, error);
    throw error;
  }
  
  return data[0] as Chapter;
};
