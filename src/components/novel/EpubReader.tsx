
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEpubReader } from './epub/useEpubReader';
import EpubControls from './epub/EpubControls';
import EpubRenderer from './epub/EpubRenderer';
import EpubNavigation from './epub/EpubNavigation';
import './epub-reader.css';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EpubReaderProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_LOADING_TIME = 30000; // 30 ثانية كحد أقصى للتحميل

const EpubReader = ({ url, title, isOpen, onClose }: EpubReaderProps) => {
  const { toast } = useToast();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(null);
  
  const {
    viewerRef,
    rendition,
    isLoading,
    error,
    isDarkMode,
    currentPage,
    totalPages,
    progressPercentage,
    nextPage,
    prevPage,
    toggleDarkMode,
    changeFontSize,
    exportEpub,
    resetReader
  } = useEpubReader({ url, title, isOpen });
  
  // إعادة تحميل الكتاب
  const reloadBook = () => {
    console.log("إعادة تحميل الكتاب...");
    setTimeoutOccurred(false);
    resetReader();
  };
  
  // مراقبة حالة التحميل المستمرة لمدة طويلة
  useEffect(() => {
    if (isOpen && isLoading && !error) {
      // إلغاء أي مؤقت سابق
      if (loadingTimer) clearTimeout(loadingTimer);
      
      // إنشاء مؤقت جديد للتحميل
      const timer = setTimeout(() => {
        setTimeoutOccurred(true);
        console.warn("تم تجاوز الوقت المسموح لتحميل الكتاب");
        
        toast({
          title: "استغرق التحميل وقتًا طويلاً",
          description: "يبدو أن هناك مشكلة في تحميل الكتاب. يمكنك إعادة المحاولة أو إغلاق القارئ.",
          variant: "destructive",
        });
      }, MAX_LOADING_TIME);
      
      setLoadingTimer(timer);
      return () => clearTimeout(timer);
    } else if (loadingTimer) {
      // إلغاء المؤقت إذا لم يعد التحميل جاريًا
      clearTimeout(loadingTimer);
      setLoadingTimer(null);
    }
  }, [isOpen, isLoading, error, toast]);
  
  // تحسين تجربة المستخدم - إغلاق القارئ تلقائياً إذا كان الخطأ شديداً
  useEffect(() => {
    if (error && error.includes("فشل في تحميل الكتاب الإلكتروني")) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // إغلاق بعد 10 ثوانٍ
      
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);
  
  // عرض حالة التحميل المستمرة لوقت طويل
  const renderTimeoutContent = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center bg-white/90 dark:bg-mihrab-dark/90 p-8 rounded-lg shadow-lg max-w-md">
        <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <p className="text-mihrab-dark dark:text-mihrab-cream text-lg font-bold mb-2">استغرق التحميل وقتًا طويلاً</p>
        <p className="text-mihrab-dark/70 dark:text-mihrab-cream/70 text-sm mb-4">
          يبدو أن هناك صعوبة في تحميل الكتاب. قد يكون السبب:
        </p>
        <ul className="text-mihrab-dark/70 dark:text-mihrab-cream/70 text-sm list-disc text-right mb-4 pr-5">
          <li>حجم الكتاب كبير جدًا</li>
          <li>هناك مشكلة في تنسيق الملف</li>
          <li>اتصال الإنترنت بطيء</li>
        </ul>
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={reloadBook}
            variant="outline"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4 ml-1" />
            إعادة المحاولة
          </Button>
          <Button 
            onClick={onClose}
            variant="default"
            className="bg-mihrab/80 text-white hover:bg-mihrab"
          >
            إغلاق القارئ
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-mihrab-dark/50 dark:text-mihrab-cream/50 border-t border-gray-200 dark:border-gray-700 pt-4">
          <details>
            <summary className="cursor-pointer">معلومات تشخيصية</summary>
            <div className="mt-2 text-left overflow-auto max-h-32 p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <code>URL: {url}</code>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`w-[90vw] max-w-[1000px] h-[85vh] max-h-[800px] p-0 flex flex-col ${isDarkMode ? 'dark' : ''}`} 
        dir="rtl"
      >
        <DialogHeader className="px-0 py-0">
          <DialogTitle className="sr-only">
            <VisuallyHidden>قارئ الكتب الإلكترونية - {title}</VisuallyHidden>
          </DialogTitle>
          
          <EpubControls
            title={title}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            changeFontSize={changeFontSize}
            exportEpub={exportEpub}
            reloadBook={reloadBook}
            isLoading={isLoading}
          />
          
          <DialogClose className="absolute top-3 left-3 text-mihrab hover:text-mihrab-dark dark:text-mihrab-cream dark:hover:text-white" />
        </DialogHeader>
        
        <DialogDescription className="text-center text-xs pt-0 mt-0 dark:text-mihrab-cream/70">
          {isLoading ? 'جاري تحميل الكتاب، يرجى الانتظار...' : 'استخدم الأزرار أسفل الكتاب أو انقر على جانبي الصفحة للتنقل بين الصفحات'}
        </DialogDescription>
        
        <div className="flex-1 relative overflow-hidden bg-mihrab-beige/30 dark:bg-mihrab-dark/60">
          {timeoutOccurred && isLoading && renderTimeoutContent()}
          
          <EpubRenderer
            isLoading={isLoading}
            error={error}
            url={url}
            onClose={onClose}
            renditionRef={rendition}
            viewerRef={viewerRef}
            prevPage={prevPage}
            nextPage={nextPage}
            reloadBook={reloadBook}
          />
          
          {/* شريط التقدم */}
          {!error && (
            <EpubNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              progressPercentage={progressPercentage}
              prevPage={prevPage}
              nextPage={nextPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EpubReader;
