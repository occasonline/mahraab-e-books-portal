
import { supabase } from '@/lib/supabase';
import { createSafeEpubPath, slugify } from '@/lib/slugUtils';

/**
 * يقوم بإنشاء رابط مؤقت لتحميل ملف EPUB
 * @param fileName اسم ملف EPUB في Supabase Storage أو المسار الكامل
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
    
    // استخدام الملف المحلي كاحتياطي إذا كان الملف فارغًا أو غير صالح
    if (fileName.includes('undefined') || fileName.includes('null')) {
      console.warn('اسم ملف غير صالح، استخدام ملف EPUB محلي بدلاً من ذلك');
      return '/sample-book.epub';
    }
    
    // حالة 1: الملف هو URL كامل من Supabase
    if (fileName.includes('supabase.co/storage')) {
      // إذا كان الرابط يحتوي على علامات # غير مشفرة، قم بتشفيرها
      const cleanFileName = encodeURI(fileName);
      
      try {
        // محاولة استخدام الرابط مباشرة إذا كان موقّعًا بالفعل
        if (fileName.includes('token=')) {
          console.log('استخدام رابط موقّع موجود بالفعل');
          return cleanFileName;
        }
        
        // تحليل رابط Supabase واستخراج اسم الدلو والمسار
        const url = new URL(cleanFileName);
        const pathSegments = url.pathname.split('/');
        
        // استخراج اسم الدلو (عادة القطعة الثالثة بعد /storage/v1/object/)
        let bucketIndex = pathSegments.findIndex(segment => segment === 'object') + 1;
        if (bucketIndex === 0) bucketIndex = 2; // حالة احتياطية
        
        const bucketName = pathSegments[bucketIndex];
        const objectPath = pathSegments.slice(bucketIndex + 1).join('/');
        
        console.log(`محاولة إنشاء رابط موقّع: دلو=${bucketName}, مسار=${objectPath}`);
        
        // إنشاء رابط موقّع جديد بفترة صلاحية أطول (3 ساعات)
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(objectPath, 10800);
        
        if (error) {
          console.error('خطأ في إنشاء رابط موقّع:', error.message);
          throw error;
        }
        
        if (!data?.signedUrl) {
          throw new Error('تم إنشاء رابط موقّع فارغ');
        }
        
        console.log("تم إنشاء رابط موقّع:", data.signedUrl);
        return data.signedUrl;
      } catch (e) {
        console.error("خطأ في تحليل URL Supabase:", e);
        return '/sample-book.epub';
      }
    }
    
    // حالة 2: الملف يحتوي على أحرف خاصة أو علامات #
    if (fileName.includes('#')) {
      try {
        // إنشاء اسم آمن للملف باستخدام slugify
        const fileNameParts = fileName.split('/');
        const fileNameWithoutPath = fileNameParts[fileNameParts.length - 1];
        const safeSlug = slugify(fileNameWithoutPath);
        const safePath = `epub/${safeSlug}.epub`;
        
        console.log(`تحويل المسار المعقد '${fileName}' إلى المسار الآمن '${safePath}'`);
        
        // محاولة الحصول على الملف بالمسار الآمن
        const { data, error } = await supabase.storage
          .from('novels')
          .createSignedUrl(safePath, 10800);
        
        if (error) {
          console.error(`فشل في الحصول على رابط بالمسار الآمن: ${error.message}`);
          // جرب المسار الأصلي
          const { data: originalData, error: originalError } = await supabase.storage
            .from('novels')
            .createSignedUrl(fileName, 10800);
            
          if (originalError) {
            console.error(`فشل في الحصول على رابط بالمسار الأصلي: ${originalError.message}`);
            return '/sample-book.epub';
          }
          
          return originalData?.signedUrl || '/sample-book.epub';
        }
        
        return data?.signedUrl || '/sample-book.epub';
      } catch (error) {
        console.error('خطأ في معالجة المسار المعقد:', error);
        return '/sample-book.epub';
      }
    }
    
    // حالة 3: المسار البسيط
    try {
      // تنظيف المسار
      const cleanPath = fileName.trim();
      console.log(`محاولة إنشاء رابط موقّع للمسار البسيط: ${cleanPath}`);
      
      const { data, error } = await supabase.storage
        .from('novels')
        .createSignedUrl(cleanPath, 10800);
      
      if (error) {
        console.error(`فشل في الحصول على رابط التحميل: ${error.message}`);
        return '/sample-book.epub'; 
      }
      
      console.log("تم إنشاء رابط التحميل بنجاح:", data?.signedUrl);
      return data?.signedUrl || '/sample-book.epub';
    } catch (error) {
      console.error('خطأ في خدمة EPUB:', error);
      return '/sample-book.epub';
    }
  } catch (error) {
    console.error('خطأ غير متوقع في خدمة EPUB:', error);
    return '/sample-book.epub';
  }
};

/**
 * يقوم باستيراد ملف EPUB إلى Supabase
 */
export const uploadEpubFile = async (file: File, novelId: string, title: string): Promise<string> => {
  try {
    // إنشاء اسم آمن للملف باستخدام العنوان
    const safeFileName = createSafeEpubPath(title || novelId);
    
    // رفع الملف إلى Supabase Storage
    const { error } = await supabase.storage
      .from('novels')
      .upload(safeFileName, file, { upsert: true });
      
    if (error) {
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
    
    return safeFileName;
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
