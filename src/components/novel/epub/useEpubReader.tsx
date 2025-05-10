
import { useState, useEffect, useRef } from 'react';
import * as epubjs from 'epubjs';
import { useToast } from "@/components/ui/use-toast";

export interface UseEpubReaderProps {
  url: string;
  title: string;
  isOpen: boolean;
}

export const useEpubReader = ({ url, title, isOpen }: UseEpubReaderProps) => {
  const { toast } = useToast();
  const viewerRef = useRef<HTMLDivElement>(null);
  const book = useRef<any>(null);
  const rendition = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(100); // percentage
  const [error, setError] = useState<string | null>(null);
  const STORAGE_KEY = `epub-reader-${title}`;
  const loadingTimeoutRef = useRef<number | null>(null);
  
  // تحميل الكتاب عند فتح القارئ
  useEffect(() => {
    if (!isOpen) return;
    
    // إعداد مؤقت لتحديد ما إذا كان التحميل يستغرق وقتًا طويلاً
    loadingTimeoutRef.current = window.setTimeout(() => {
      toast({
        title: "التحميل يستغرق وقتًا طويلاً",
        description: "جاري تحميل الكتاب، يرجى الانتظار...",
        duration: 5000,
      });
    }, 5000);
    
    const loadBook = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('محاولة تحميل الكتاب الإلكتروني من:', url);
        
        // تهيئة الكتاب باستخدام URL
        if (!url) {
          setError('لم يتم تحديد مسار الكتاب الإلكتروني');
          setIsLoading(false);
          return;
        }
        
        // إذا كان الكتاب قد تم تحميله مسبقًا، قم بتنظيفه
        if (book.current) {
          book.current = null;
        }
        
        // تحميل الكتاب الجديد
        const newBook = epubjs.default(url, { openAs: 'epub' });
        book.current = newBook;
        
        // انتظار تحميل الكتاب
        await newBook.ready;
        console.log('تم تحميل الكتاب بنجاح');
        
        // إنشاء المعرض
        if (viewerRef.current && book.current) {
          // تنظيف أي تحميل سابق
          if (rendition.current) {
            rendition.current.destroy();
          }
          
          viewerRef.current.innerHTML = '';
          
          // إعداد الواجهة
          rendition.current = book.current.renderTo(viewerRef.current, {
            width: '100%',
            height: '100%',
            spread: 'none',
            flow: 'paginated',
            manager: 'default'
          });
          
          const savedLocation = localStorage.getItem(STORAGE_KEY);
          
          // تطبيق إعدادات العرض قبل عرض الكتاب
          await setReaderStyles();
          
          // محاولة عرض الكتاب
          try {
            if (savedLocation) {
              await rendition.current.display(savedLocation);
              console.log('تم عرض الكتاب من الموقع المحفوظ');
            } else {
              await rendition.current.display();
              console.log('تم عرض الكتاب من البداية');
            }
          } catch (displayError) {
            console.error('خطأ في عرض الكتاب:', displayError);
            setError('فشل في عرض محتوى الكتاب، قد يكون الملف تالفًا أو منسقًا بطريقة غير متوافقة');
            setIsLoading(false);
            return;
          }
          
          // استماع لأحداث التنقل
          rendition.current.on('locationChanged', (location: any) => {
            if (location?.start?.cfi) {
              console.log('تغير موقع القراءة:', location.start.cfi);
              setCurrentLocation(location.start.cfi);
              localStorage.setItem(STORAGE_KEY, location.start.cfi);
              
              // تقدير رقم الصفحة الحالي
              const currentCfi = location.start.cfi;
              if (book.current && book.current.locations && typeof book.current.locations.percentageFromCfi === 'function') {
                try {
                  const percentage = book.current.locations.percentageFromCfi(currentCfi);
                  if (percentage !== undefined) {
                    setCurrentPage(Math.max(1, Math.ceil(percentage * totalPages)));
                  }
                } catch (err) {
                  console.error('خطأ في حساب النسبة المئوية:', err);
                }
              }
            }
          });
          
          // إعداد التنقل عبر لوحة المفاتيح
          rendition.current.on('keyup', (e: KeyboardEvent) => {
            const key = e.key;
            if (key === 'ArrowLeft') nextPage();
            if (key === 'ArrowRight') prevPage();
          });
          
          // تحديد عدد الصفحات الإجمالي بعد تحميل الكتاب
          try {
            // إنشاء مواقع الكتاب لتقدير عدد الصفحات
            if (!book.current.locations._locations) {
              console.log('جاري إنشاء قائمة الصفحات...');
              await book.current.locations.generate(1024);
              console.log('تم إنشاء قائمة الصفحات بنجاح');
            }
            
            const pageCount = Math.ceil((book.current.locations.length() || 0) / 1024) || 0;
            console.log('عدد الصفحات المقدر:', pageCount);
            setTotalPages(pageCount > 0 ? pageCount : 100); // استخدام 100 كافتراضي إذا تعذر تقدير الصفحات
          } catch (error) {
            console.error('خطأ في إنشاء قائمة الصفحات:', error);
            setTotalPages(100);
          }
          
          // تطبيق الاتجاه من اليمين إلى اليسار للمحتوى العربي
          try {
            const meta = await book.current.loaded.metadata;
            const isRTL = meta.language === 'ar' || meta.direction === 'rtl';
            console.log('هل الكتاب باللغة العربية؟', isRTL, 'اللغة:', meta.language, 'الاتجاه:', meta.direction);
            
            if (isRTL) {
              rendition.current.spread('none', { direction: 'rtl' });
              const contents = rendition.current.getContents();
              contents.forEach((content: any) => {
                if (content && content.document && content.document.documentElement) {
                  content.document.documentElement.style.direction = 'rtl';
                  content.document.documentElement.style.textAlign = 'right';
                  console.log('تم تطبيق الاتجاه من اليمين إلى اليسار');
                }
              });
            }
          } catch (error) {
            console.error('خطأ في تحديد اتجاه النص:', error);
          }
          
          // إلغاء مؤقت التحميل الطويل
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
          
          // إشعار بنجاح التحميل
          toast({
            title: "تم تحميل الكتاب بنجاح",
            description: `يمكنك الآن قراءة ${title}`,
            duration: 3000,
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('خطأ في تحميل الكتاب الإلكتروني:', error);
        setError('فشل في تحميل الكتاب الإلكتروني. يرجى المحاولة مرة أخرى لاحقًا.');
        
        // إلغاء مؤقت التحميل الطويل
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الكتاب",
          description: "حدث خطأ أثناء محاولة تحميل الكتاب. يرجى المحاولة مرة أخرى.",
          duration: 5000,
        });
        
        setIsLoading(false);
      }
    };
    
    loadBook();
    
    // التنظيف عند إغلاق القارئ
    return () => {
      // إلغاء مؤقت التحميل الطويل
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      if (rendition.current) {
        try {
          rendition.current.destroy();
        } catch (err) {
          console.error('خطأ أثناء تدمير العرض:', err);
        }
      }
    };
  }, [isOpen, url, STORAGE_KEY, totalPages, toast, title]);
  
  // تطبيق إعدادات العرض (الوضع المظلم، حجم الخط)
  const setReaderStyles = async () => {
    if (rendition.current) {
      // تطبيق إعدادات الوضع الليلي
      const theme = {
        body: {
          background: isDarkMode ? '#222' : '#fff',
          color: isDarkMode ? '#fff' : '#000'
        },
        ':root': {
          '--bg-color': isDarkMode ? '#222' : '#fff',
          '--text-color': isDarkMode ? '#fff' : '#000',
          '--font-size': `${fontSize}%`,
          'font-size': `${fontSize}%`,
        },
        'p, div, span, h1, h2, h3, h4, h5, h6': {
          'font-family': 'Amiri, serif',
          color: isDarkMode ? '#eee' : '#333'
        },
        'a': {
          color: isDarkMode ? '#9db1cc' : '#0066cc',
        }
      };
      
      rendition.current.themes.register('custom', theme);
      rendition.current.themes.select('custom');
    }
  };
  
  // تطبيق إعدادات العرض عند تغييرها
  useEffect(() => {
    setReaderStyles();
  }, [isDarkMode, fontSize]);
  
  const nextPage = () => {
    if (rendition.current) {
      rendition.current.next();
    }
  };
  
  const prevPage = () => {
    if (rendition.current) {
      rendition.current.prev();
    }
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const changeFontSize = (increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment 
        ? Math.min(prev + 10, 200)  // زيادة بمقدار 10% حتى 200%
        : Math.max(prev - 10, 60);  // تقليل بمقدار 10% حتى 60%
      return newSize;
    });
  };
  
  // وظائف التصدير
  const exportEpub = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.epub`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "جاري تنزيل الكتاب",
      description: `تم بدء تنزيل ${title}.epub`,
      duration: 3000,
    });
  };
  
  // حساب نسبة التقدم
  const progressPercentage = totalPages > 0 
    ? Math.round((Math.max(1, currentPage) / totalPages) * 100)
    : 0;
  
  return {
    viewerRef,
    rendition,
    book,
    currentLocation,
    currentPage,
    totalPages,
    isLoading,
    isDarkMode,
    fontSize,
    error,
    progressPercentage,
    nextPage,
    prevPage,
    toggleDarkMode,
    changeFontSize,
    exportEpub,
    setReaderStyles
  };
};
