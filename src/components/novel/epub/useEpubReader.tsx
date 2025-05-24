
import { useState, useEffect, useRef, useCallback } from 'react';
import * as epubjs from 'epubjs';
import { useToast } from "@/hooks/use-toast";

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
  const [fontSize, setFontSize] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const STORAGE_KEY = `epub-reader-${title}`;
  const loadingTimeoutRef = useRef<number | null>(null);
  const initialLoadRef = useRef<boolean>(true);
  
  // إعادة تعيين القارئ
  const resetReader = useCallback(() => {
    console.log("إعادة تعيين القارئ...");
    
    if (rendition.current) {
      try {
        rendition.current.destroy();
        rendition.current = null;
      } catch (e) {
        console.error("خطأ في تنظيف العرض السابق:", e);
      }
    }
    
    if (book.current) {
      try {
        book.current.destroy();
        book.current = null;
      } catch (e) {
        console.error("خطأ في تنظيف الكتاب السابق:", e);
      }
    }
    
    setError(null);
    setIsLoading(true);
    setCurrentLocation(null);
    setTotalPages(0);
    setCurrentPage(0);
    
    if (viewerRef.current) {
      viewerRef.current.innerHTML = '';
    }
    
    setTimeout(() => {
      initialLoadRef.current = true; 
      loadBook();
    }, 100);
  }, [url]);
  
  // تحميل الكتاب مع معالجة محسّنة للأخطاء
  const loadBook = useCallback(async () => {
    if (!isOpen || !url) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // مهلة زمنية أطول للتحميل
      loadingTimeoutRef.current = window.setTimeout(() => {
        console.warn("التحميل يستغرق وقتاً طويلاً، المحاولة مرة أخرى...");
        setError("فشل في تحميل الكتاب. يرجى إعادة المحاولة.");
        setIsLoading(false);
      }, 60000); // 60 ثانية بدلاً من 30
      
      console.log('محاولة تحميل الكتاب الإلكتروني من:', url);
      
      // تنظيف الكتاب السابق
      if (rendition.current) {
        try {
          rendition.current.destroy();
          rendition.current = null;
        } catch (e) {
          console.error("خطأ في تنظيف العرض السابق:", e);
        }
      }
      
      if (book.current) {
        try {
          book.current.destroy();
          book.current = null;
        } catch (e) {
          console.error("خطأ في تنظيف الكتاب السابق:", e);
        }
      }
      
      if (!url) {
        setError('لم يتم تحديد مسار الكتاب الإلكتروني');
        setIsLoading(false);
        return;
      }
      
      // معالجة URL خاص
      let processedUrl = url;
      if (url.includes('#') && !url.includes('%23')) {
        processedUrl = url.replace(/#/g, '%23');
        console.log("تم معالجة URL:", processedUrl);
      }
      
      // تحميل الكتاب بخيارات مبسّطة
      const newBook = epubjs.default(processedUrl, { 
        openAs: 'epub'
      });
      
      book.current = newBook;
      
      // انتظار تحميل الكتاب مع مهلة زمنية محددة
      try {
        await Promise.race([
          newBook.ready,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("انتهت مهلة التحميل")), 45000)
          )
        ]);
        
        console.log('تم تحميل الكتاب بنجاح');
        
        if (viewerRef.current && book.current) {
          viewerRef.current.innerHTML = '';
          
          // إنشاء المعرض
          rendition.current = book.current.renderTo(viewerRef.current, {
            width: '100%',
            height: '100%',
            spread: 'none',
            flow: 'paginated'
          });
          
          const savedLocation = localStorage.getItem(STORAGE_KEY);
          
          // تطبيق الأنماط
          await setReaderStyles();
          
          // عرض الكتاب
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
            // محاولة عرض من البداية
            try {
              await rendition.current.display();
              console.log('تم عرض الكتاب من البداية بعد فشل الموقع المحفوظ');
            } catch (fallbackError) {
              console.error('فشل في عرض الكتاب:', fallbackError);
              setError('فشل في عرض محتوى الكتاب');
              setIsLoading(false);
              return;
            }
          }
          
          // إعداد أحداث التنقل
          rendition.current.on('locationChanged', (location: any) => {
            if (location?.start?.cfi) {
              console.log('تغير موقع القراءة:', location.start.cfi);
              setCurrentLocation(location.start.cfi);
              localStorage.setItem(STORAGE_KEY, location.start.cfi);
              
              if (book.current && book.current.locations && book.current.locations.percentageFromCfi) {
                try {
                  const percentage = book.current.locations.percentageFromCfi(location.start.cfi);
                  if (percentage !== undefined) {
                    setCurrentPage(Math.max(1, Math.ceil(percentage * totalPages)));
                  }
                } catch (err) {
                  console.error('خطأ في حساب النسبة المئوية:', err);
                }
              }
            }
          });
          
          // إعداد التنقل بالمفاتيح
          rendition.current.on('keyup', (e: KeyboardEvent) => {
            const key = e.key;
            if (key === 'ArrowLeft') nextPage();
            if (key === 'ArrowRight') prevPage();
          });
          
          // إنشاء مواقع الصفحات
          try {
            if (!book.current.locations._locations) {
              console.log('جاري إنشاء قائمة الصفحات...');
              await book.current.locations.generate(1024);
              console.log('تم إنشاء قائمة الصفحات بنجاح');
            }
            
            const pageCount = Math.ceil((book.current.locations.length() || 0) / 1024) || 100;
            console.log('عدد الصفحات المقدر:', pageCount);
            setTotalPages(pageCount);
          } catch (error) {
            console.error('خطأ في إنشاء قائمة الصفحات:', error);
            setTotalPages(100);
          }
          
          // تطبيق اتجاه النص
          try {
            const meta = await book.current.loaded.metadata;
            const isRTL = meta.language === 'ar' || meta.direction === 'rtl';
            console.log('اتجاه النص RTL:', isRTL);
            
            if (isRTL) {
              rendition.current.spread('none', { direction: 'rtl' });
              const contents = rendition.current.getContents();
              contents.forEach((content: any) => {
                if (content && content.document && content.document.documentElement) {
                  content.document.documentElement.style.direction = 'rtl';
                  content.document.documentElement.style.textAlign = 'right';
                }
              });
            }
          } catch (error) {
            console.error('خطأ في تحديد اتجاه النص:', error);
          }
          
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
          
          if (initialLoadRef.current) {
            initialLoadRef.current = false;
            toast({
              title: "تم تحميل الكتاب بنجاح",
              description: `يمكنك الآن قراءة ${title}`,
              duration: 3000,
            });
          }
          
          setIsLoading(false);
        } else {
          setError('فشل في تهيئة عارض الكتاب');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('خطأ في تحميل الكتاب الإلكتروني:', error);
        
        // إذا كان هناك خطأ في التحميل، جرب مع ملف تجريبي
        if (url !== '/sample-book.epub') {
          console.log('محاولة تحميل ملف تجريبي...');
          setError('فشل في تحميل الكتاب الأصلي، جاري تحميل نموذج تجريبي...');
          
          try {
            const sampleBook = epubjs.default('/sample-book.epub', { openAs: 'epub' });
            book.current = sampleBook;
            await sampleBook.ready;
            
            if (viewerRef.current) {
              viewerRef.current.innerHTML = '';
              rendition.current = sampleBook.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none',
                flow: 'paginated'
              });
              
              await rendition.current.display();
              setError(null);
              setIsLoading(false);
              
              toast({
                title: "تم تحميل كتاب تجريبي",
                description: "تم تحميل كتاب تجريبي للعرض",
                duration: 3000,
              });
              
              return;
            }
          } catch (sampleError) {
            console.error('فشل في تحميل الكتاب التجريبي:', sampleError);
          }
        }
        
        setError('فشل في تحميل الكتاب الإلكتروني. يرجى المحاولة مرة أخرى.');
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الكتاب",
          description: "حدث خطأ أثناء تحميل الكتاب. يرجى إعادة المحاولة.",
          duration: 5000,
        });
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('خطأ عام في تحميل الكتاب:', error);
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      setIsLoading(false);
    }
  }, [isOpen, url, STORAGE_KEY, totalPages, toast, title]);
  
  // تحميل الكتاب عند فتح القارئ
  useEffect(() => {
    if (isOpen) {
      loadBook();
    }
    
    return () => {
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
  }, [isOpen, loadBook]);
  
  // تطبيق إعدادات العرض (الوضع المظلم، حجم الخط)
  const setReaderStyles = async () => {
    if (rendition.current) {
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
        ? Math.min(prev + 10, 200)
        : Math.max(prev - 10, 60);
      return newSize;
    });
  };
  
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
    setReaderStyles,
    resetReader
  };
};
