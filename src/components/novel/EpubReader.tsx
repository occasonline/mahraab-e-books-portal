
import React, { useState, useEffect, useRef } from 'react';
import { Book as EpubBook } from 'epubjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Moon, Sun, Type, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import './epub-reader.css';

interface EpubReaderProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const EpubReader = ({ url, title, isOpen, onClose }: EpubReaderProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const book = useRef<EpubBook | null>(null);
  const rendition = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(100); // percentage
  const STORAGE_KEY = `epub-reader-${title}`;
  
  // تحميل الكتاب عند فتح القارئ
  useEffect(() => {
    if (!isOpen || !url) return;
    
    const loadBook = async () => {
      try {
        setIsLoading(true);
        
        // تهيئة الكتاب باستخدام URL
        if (!book.current) {
          book.current = window.ePub ? window.ePub(url) : new EpubBook(url);
        }
        
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
          
          // عرض الكتاب من الموقع المحفوظ أو من البداية
          if (savedLocation) {
            await rendition.current.display(savedLocation);
          } else {
            await rendition.current.display();
          }
          
          // استماع لأحداث التنقل
          rendition.current.on('locationChanged', (location: any) => {
            if (location?.start?.cfi) {
              setCurrentLocation(location.start.cfi);
              localStorage.setItem(STORAGE_KEY, location.start.cfi);
              
              // تقدير رقم الصفحة الحالي
              const currentCfi = location.start.cfi;
              book.current?.locations.percentageFromCfi(currentCfi)
                .then((percentage: number) => {
                  setCurrentPage(Math.ceil(percentage * totalPages));
                });
            }
          });
          
          // إعداد التنقل عبر لوحة المفاتيح
          rendition.current.on('keyup', (e: KeyboardEvent) => {
            const key = e.key;
            if (key === 'ArrowLeft') nextPage();
            if (key === 'ArrowRight') prevPage();
          });
          
          // تحديد عدد الصفحات الإجمالي بعد تحميل الكتاب
          const pageList = await book.current.locations.generate(1024);
          const pageCount = Math.ceil(book.current.locations.length() / 1024) || 0;
          setTotalPages(pageCount > 0 ? pageCount : 100); // استخدام 100 كافتراضي إذا تعذر تقدير الصفحات
          
          // تطبيق الاتجاه من اليمين إلى اليسار للمحتوى العربي
          const meta = await book.current.loaded.metadata;
          const isRTL = meta.language === 'ar' || meta.direction === 'rtl';
          if (isRTL) {
            rendition.current.spread('none', { direction: 'rtl' });
            const doc = rendition.current.getContents()[0]?.document;
            if (doc) {
              doc.documentElement.style.direction = 'rtl';
              doc.documentElement.style.textAlign = 'right';
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('خطأ في تحميل الكتاب الإلكتروني:', error);
        setIsLoading(false);
      }
    };
    
    loadBook();
    
    // التنظيف عند إغلاق القارئ
    return () => {
      if (rendition.current) {
        rendition.current.destroy();
      }
    };
  }, [isOpen, url, STORAGE_KEY]);
  
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
  
  // حساب نسبة التقدم
  const progressPercentage = totalPages > 0 
    ? Math.round((currentPage / totalPages) * 100)
    : 0;
  
  // وظائف التصدير
  const exportEpub = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.epub`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`w-[90vw] max-w-[1000px] h-[80vh] max-h-[800px] p-0 flex flex-col ${isDarkMode ? 'dark' : ''}`} 
        dir="rtl"
      >
        <DialogHeader className="px-4 py-2 flex flex-row justify-between items-center">
          <DialogTitle className="text-mihrab text-xl font-amiri dark:text-mihrab-cream">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? "وضع النهار" : "الوضع المظلم"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => changeFontSize(false)}
              title="تصغير الخط"
            >
              <Type className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => changeFontSize(true)}
              title="تكبير الخط"
            >
              <Type className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportEpub}>
                  تنزيل ملف EPUB
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogClose className="text-mihrab hover:text-mihrab-dark dark:text-mihrab-cream dark:hover:text-white" />
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-center text-xs pt-0 mt-0 dark:text-mihrab-cream/70">
          استخدم الأزرار أسفل الكتاب أو انقر على جانبي الصفحة للتنقل بين الصفحات
        </DialogDescription>
        
        <div className="flex-1 relative overflow-hidden bg-mihrab-beige/30 dark:bg-mihrab-dark/60">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-mihrab/30 border-t-mihrab rounded-full animate-spin mb-2"></div>
                <p className="text-mihrab-dark dark:text-mihrab-cream">جاري تحميل الكتاب...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 w-full h-full epub-container">
                <div ref={viewerRef} className="w-full h-full" />
              </div>
              
              {/* أزرار التنقل على جانبي الكتاب */}
              <button 
                onClick={prevPage} 
                className="absolute top-0 bottom-0 right-0 w-16 opacity-0 hover:opacity-70 transition-opacity"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="h-8 w-8 text-mihrab bg-white/80 rounded-full p-1 shadow-md dark:bg-mihrab-dark/80 dark:text-mihrab-cream" />
              </button>
              
              <button 
                onClick={nextPage} 
                className="absolute top-0 bottom-0 left-0 w-16 opacity-0 hover:opacity-70 transition-opacity"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="h-8 w-8 text-mihrab bg-white/80 rounded-full p-1 shadow-md dark:bg-mihrab-dark/80 dark:text-mihrab-cream" />
              </button>
            </>
          )}
          
          {/* شريط التقدم */}
          <div className="absolute bottom-4 left-0 right-0 px-8">
            <div className="bg-white/90 dark:bg-mihrab-dark/90 rounded-full py-2 px-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-mihrab-dark/70 dark:text-mihrab-cream/70">
                  {progressPercentage}%
                </div>
                
                <div className="text-sm text-mihrab-dark dark:text-mihrab-cream">
                  الصفحة {currentPage} من {totalPages}
                </div>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2 dark:bg-mihrab-dark" 
              />
              
              <div className="flex justify-center gap-8 mt-4">
                <Button 
                  onClick={prevPage}
                  variant="outline" 
                  className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1 dark:bg-mihrab-dark/80 dark:text-white dark:border-mihrab-cream"
                >
                  <ChevronRight size={16} />
                  الصفحة السابقة
                </Button>
                <Button 
                  onClick={nextPage}
                  variant="outline" 
                  className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1 dark:bg-mihrab-dark/80 dark:text-white dark:border-mihrab-cream"
                >
                  الصفحة التالية
                  <ChevronLeft size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EpubReader;
