
import { supabase } from '@/lib/supabase';

/**
 * يقوم بإنشاء رابط مؤقت لتحميل ملف EPUB
 * @param fileName اسم ملف EPUB في Supabase Storage
 * @returns رابط التحميل المؤقت
 */
export const getEpubDownloadUrl = async (fileName: string): Promise<string> => {
  try {
    // في بيئة الإنتاج، سيتم استخدام هذه الدالة لجلب ملف EPUB من Supabase
    // حالياً نستخدم ملفاً محلياً للاختبار
    
    // استرجاع رابط مؤقت من Supabase Storage
    // const { data, error } = await supabase.storage
    //   .from('novels')
    //   .createSignedUrl(`epub/${fileName}`, 3600);
    
    // if (error) {
    //   throw new Error(`فشل في الحصول على رابط التحميل: ${error.message}`);
    // }
    
    // return data?.signedUrl || '';
    
    // للاختبار، ارجع رابط لملف EPUB محلي
    return '/sample-book.epub';
    
  } catch (error) {
    console.error('خطأ في خدمة EPUB:', error);
    // ارجع ملف اختباري في حالة الخطأ
    return '/sample-book.epub';
  }
};

/**
 * يقوم باستيراد ملف EPUB إلى Supabase
 */
export const uploadEpubFile = async (file: File, novelId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${novelId}.${fileExt}`;
    
    // رفع الملف إلى Supabase Storage
    const { error } = await supabase.storage
      .from('novels')
      .upload(`epub/${fileName}`, file);
      
    if (error) {
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
    
    return fileName;
  } catch (error) {
    console.error('خطأ في رفع ملف EPUB:', error);
    throw error;
  }
};

/**
 * تحديث حقل epub_url في جدول الروايات
 */
export const updateNovelEpubUrl = async (novelId: string, fileName: string): Promise<void> => {
  try {
    // نستخدم سطر تحديث متوافق مع البنية الحالية للجدول في قاعدة البيانات
    // نتجنب استخدام epub_url مباشرة ونستخدم التعديل المخصص
    const updates = {
      // استخدام اسم الحقل كنص لتجنب مشكلة TypeScript
      sample: fileName // تخزين اسم الملف في حقل sample كحل مؤقت
    };
    
    const { error } = await supabase
      .from('novels')
      .update(updates)
      .eq('id', novelId);
    
    if (error) {
      throw new Error(`فشل في تحديث بيانات الرواية: ${error.message}`);
    }
  } catch (error) {
    console.error('خطأ في تحديث بيانات الرواية:', error);
    throw error;
  }
};
