
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
  
  // تنظيف الموارد
  const cleanup = useCallback(() => {
    console.log("تنظيف موارد القارئ...");
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    if (rendition.current) {
      try {
        rendition.current.destroy();
      } catch (e) {
        console.warn("خطأ في تنظيف العرض:", e);
      }
      rendition.current = null;
    }
    
    if (book.current) {
      try {
        book.current.destroy();
      } catch (e) {
        console.warn("خطأ في تنظيف الكتاب:", e);
      }
      book.current = null;
    }
    
    if (viewerRef.current) {
      viewerRef.current.innerHTML = '';
    }
  }, []);
  
  // إعادة تعيين القارئ
  const resetReader = useCallback(() => {
    console.log("إعادة تعيين القارئ...");
    cleanup();
    setError(null);
    setIsLoading(true);
    setCurrentLocation(null);
    setTotalPages(0);
    setCurrentPage(0);
    
    setTimeout(() => {
      loadBook();
    }, 500);
  }, []);
  
  // تحميل الكتاب مع إعدادات مبسطة
  const loadBook = useCallback(async () => {
    if (!isOpen || !url || !viewerRef.current) {
      console.log("شروط التحميل غير مكتملة:", { isOpen, url: !!url, viewer: !!viewerRef.current });
      return;
    }
    
    console.log("بدء تحميل الكتاب:", url);
    setIsLoading(true);
    setError(null);
    
    // مهلة زمنية معقولة (15 ثانية)
    loadingTimeoutRef.current = window.setTimeout(() => {
      console.error("انتهت مهلة تحميل الكتاب");
      setError("فشل في تحميل الكتاب - انتهت المهلة الزمنية");
      setIsLoading(false);
    }, 15000);
    
    try {
      // تنظيف أي كتاب سابق
      cleanup();
      
      // إنشاء كتاب جديد بإعدادات بسيطة
      console.log("إنشاء كتاب جديد...");
      const newBook = epubjs.default ? epubjs.default(url) : new (epubjs as any).Book(url);
      book.current = newBook;
      
      // انتظار تحميل الكتاب مع معالجة الأخطاء
      console.log("انتظار تحميل الكتاب...");
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("انتهت مهلة تحميل بيانات الكتاب"));
        }, 10000);
        
        newBook.ready.then(() => {
          clearTimeout(timeout);
          console.log("تم تحميل بيانات الكتاب بنجاح");
          resolve(true);
        }).catch((err: any) => {
          clearTimeout(timeout);
          console.error("خطأ في تحميل بيانات الكتاب:", err);
          reject(err);
        });
      });
      
      // إنشاء العرض
      console.log("إنشاء عرض الكتاب...");
      if (!viewerRef.current) {
        throw new Error("عنصر العرض غير متاح");
      }
      
      viewerRef.current.innerHTML = '';
      rendition.current = newBook.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        spread: 'none',
        flow: 'paginated'
      });
      
      // عرض الكتاب
      console.log("عرض الكتاب...");
      const savedLocation = localStorage.getItem(STORAGE_KEY);
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("انتهت مهلة عرض الكتاب"));
        }, 8000);
        
        const displayPromise = savedLocation && savedLocation !== 'null' 
          ? rendition.current.display(savedLocation)
          : rendition.current.display();
          
        displayPromise.then(() => {
          clearTimeout(timeout);
          console.log("تم عرض الكتاب بنجاح");
          resolve(true);
        }).catch((err: any) => {
          clearTimeout(timeout);
          console.warn("خطأ في عرض الموقع المحفوظ، المحاولة من البداية:", err);
          // محاولة العرض من البداية
          rendition.current.display().then(() => {
            resolve(true);
          }).catch(reject);
        });
      });
      
      // إعداد الأحداث
      setupEvents();
      
      // إنشاء قائمة الصفحات
      try {
        console.log("إنشاء قائمة الصفحات...");
        await newBook.locations.generate(1600);
        const pageCount = newBook.locations.length() || 50;
        setTotalPages(pageCount);
        console.log("تم إنشاء قائمة الصفحات:", pageCount);
      } catch (locationError) {
        console.warn("فشل في إنشاء قائمة الصفحات:", locationError);
        setTotalPages(50); // قيمة افتراضية
      }
      
      // تطبيق الأنماط
      applyStyles();
      
      // إلغاء مؤقت التحميل
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      setIsLoading(false);
      console.log("تم تحميل الكتاب بنجاح!");
      
      toast({
        title: "تم تحميل الكتاب بنجاح",
        description: `يمكنك الآن قراءة ${title}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("خطأ في تحميل الكتاب:", error);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      setError(`فشل في تحميل الكتاب: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "خطأ في تحميل الكتاب",
        description: "حدث خطأ أثناء تحميل الكتاب. يرجى إعادة المحاولة.",
        duration: 5000,
      });
    }
  }, [isOpen, url, STORAGE_KEY, title, toast, cleanup]);
  
  // إعداد أحداث التنقل
  const setupEvents = useCallback(() => {
    if (!rendition.current) return;
    
    console.log("إعداد أحداث التنقل...");
    
    rendition.current.on('locationChanged', (location: any) => {
      if (location?.start?.cfi) {
        console.log('تغير موقع القراءة:', location.start.cfi);
        setCurrentLocation(location.start.cfi);
        localStorage.setItem(STORAGE_KEY, location.start.cfi);
        
        if (book.current?.locations?.percentageFromCfi) {
          try {
            const percentage = book.current.locations.percentageFromCfi(location.start.cfi);
            if (percentage !== undefined && totalPages > 0) {
              setCurrentPage(Math.max(1, Math.ceil(percentage * totalPages)));
            }
          } catch (err) {
            console.warn('خطأ في حساب النسبة المئوية:', err);
          }
        }
      }
    });
    
    rendition.current.on('keyup', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') nextPage();
      if (e.key === 'ArrowRight') prevPage();
    });
  }, [STORAGE_KEY, totalPages]);
  
  // تطبيق الأنماط
  const applyStyles = useCallback(() => {
    if (!rendition.current) return;
    
    console.log("تطبيق أنماط العرض...");
    
    const theme = {
      body: {
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#e5e5e5' : '#333333',
        'font-family': 'Amiri, serif',
        'font-size': `${fontSize}%`,
        'line-height': '1.6',
        direction: 'rtl',
        'text-align': 'justify'
      },
      'p, div, span, h1, h2, h3, h4, h5, h6': {
        'font-family': 'Amiri, serif !important',
        color: isDarkMode ? '#e5e5e5' : '#333333',
        direction: 'rtl'
      }
    };
    
    try {
      rendition.current.themes.register('custom', theme);
      rendition.current.themes.select('custom');
    } catch (styleError) {
      console.warn("خطأ في تطبيق الأنماط:", styleError);
    }
  }, [isDarkMode, fontSize]);
  
  // تحميل الكتاب عند فتح القارئ
  useEffect(() => {
    if (isOpen) {
      loadBook();
    }
    
    return cleanup;
  }, [isOpen, loadBook, cleanup]);
  
  // تطبيق الأنماط عند تغييرها
  useEffect(() => {
    applyStyles();
  }, [isDarkMode, fontSize, applyStyles]);
  
  const nextPage = useCallback(() => {
    if (rendition.current) {
      rendition.current.next();
    }
  }, []);
  
  const prevPage = useCallback(() => {
    if (rendition.current) {
      rendition.current.prev();
    }
  }, []);
  
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  const changeFontSize = useCallback((increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment 
        ? Math.min(prev + 10, 200)
        : Math.max(prev - 10, 60);
      return newSize;
    });
  }, []);
  
  const exportEpub = useCallback(() => {
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
  }, [url, title, toast]);
  
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
    resetReader
  };
};
