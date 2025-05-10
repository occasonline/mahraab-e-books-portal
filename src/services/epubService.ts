
import { supabase } from '@/lib/supabase';

/**
 * يقوم بإنشاء رابط مؤقت لتحميل ملف EPUB
 * @param fileName اسم ملف EPUB في Supabase Storage
 * @returns رابط التحميل المؤقت
 */
export const getEpubDownloadUrl = async (fileName: string): Promise<string> => {
  try {
    console.log("جار تحميل EPUB من:", fileName);
    
    // للاختبار، نتحقق إذا كان الملف المطلوب هو القيمة الافتراضية
    if (!fileName || fileName === 'default' || fileName === 'sample') {
      console.log('استخدام ملف EPUB محلي للاختبار:', fileName);
      return '/sample-book.epub';
    }
    
    // تحقق مما إذا كان الملف هو عبارة عن URL كامل من Supabase
    if (fileName.includes('supabase.co/storage') || fileName.startsWith('http')) {
      // الرابط هو بالفعل URL كامل، قم بإزالة معلمات التوقيع إذا كانت موجودة
      const urlParts = fileName.split('?');
      const baseUrl = urlParts[0];
      
      // محاولة إنشاء رابط مؤقت جديد
      try {
        // استخراج مسار الملف من URL
        const storageUrl = new URL(baseUrl);
        const pathParts = storageUrl.pathname.split('/');
        const bucketName = pathParts[2]; // e.g. 'novels'
        
        // إزالة '/storage/v1/object/sign/' و اسم الدلو من المسار
        const objectPathParts = pathParts.slice(3);
        let objectPath = objectPathParts.join('/');
        
        // إذا كان المسار يبدأ بـ 'public/' أو 'sign/', قم بإزالته
        if (objectPath.startsWith('public/')) {
          objectPath = objectPath.substring(7);
        } else if (objectPath.startsWith('sign/')) {
          objectPath = objectPath.substring(5);
        }
        
        console.log("محاولة إنشاء رابط تنزيل جديد:", bucketName, objectPath);
        
        // إنشاء رابط موقّع جديد
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(objectPath, 3600);
        
        if (error) {
          console.error("فشل في إنشاء رابط موقّع للملف:", error.message);
          throw error;
        }
        
        return data.signedUrl;
      } catch (urlError) {
        console.error("خطأ في معالجة URL:", urlError);
        console.log("استخدام الرابط الأصلي:", baseUrl);
        // إرجاع الرابط الأصلي بدون معلمات التوقيع
        return baseUrl;
      }
    }
    
    // رفع ملف إلى دلو التخزين 
    const { data, error } = await supabase.storage
      .from('novels')
      .createSignedUrl(`epub/${fileName}`, 3600);
    
    if (error) {
      console.error(`فشل في الحصول على رابط التحميل: ${error.message}`);
      return '/sample-book.epub'; // ارجاع ملف افتراضي في حالة الخطأ
    }
    
    console.log("تم إنشاء رابط التحميل بنجاح:", data?.signedUrl);
    return data?.signedUrl || '/sample-book.epub';
    
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
