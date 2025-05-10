
/**
 * يقوم بإنشاء سلغ آمن للاستخدام في URLs من نص معين
 * هذه وظيفة بسيطة لتحويل النصوص العربية إلى سلغ بدون استخدام مكتبة خارجية
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  // معالجة العلامات الخاصة مثل #
  const preprocessed = text.replace(/#/g, 'hash');
  
  // استبدال المسافات والأحرف الخاصة بشرطات
  let slug = preprocessed
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
  // إضافة بريفيكس للعناوين العربية
  if (/[\u0600-\u06FF]/.test(text)) {
    slug = `ar-${slug}`;
  }
  
  return slug;
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
