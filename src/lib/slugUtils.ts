
/**
 * يقوم بإنشاء سلغ آمن للاستخدام في URLs من نص معين
 * هذه وظيفة بسيطة لتحويل النصوص العربية إلى سلغ بدون استخدام مكتبة خارجية
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  // تنظيف النص من الرموز الخاصة وأحرف التنسيق
  let cleanText = text.toString();
  
  // معالجة العلامات الخاصة وتحويلها
  cleanText = cleanText
    .replace(/#/g, 'hash')
    .replace(/[\u0600-\u06FF]/g, m => `ar${m.charCodeAt(0)}`) // تحويل الأحرف العربية إلى رموز آمنة
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  let slug = cleanText.trim().toLowerCase();
  
  // التأكد من عدم وجود أي أحرف خاصة غير مدعومة
  slug = slug.replace(/[^a-z0-9\-_]/g, '');
  
  return slug || 'epub-file';
};

/**
 * يقوم بإنشاء مسار آمن لتخزين الملفات باستخدام السلغ
 */
export const createSafeStoragePath = (fileName: string, prefix: string = 'epub'): string => {
  const safeSlug = slugify(fileName);
  return `${prefix}/${safeSlug}.epub`;
};

/**
 * يقوم بإنشاء مسار آمن لملف EPUB بناءً على عنوان الكتاب
 */
export const createSafeEpubPath = (title: string): string => {
  return createSafeStoragePath(title, 'epub');
};
