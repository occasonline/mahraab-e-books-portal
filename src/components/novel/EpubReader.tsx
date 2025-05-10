
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useEpubReader } from './epub/useEpubReader';
import EpubControls from './epub/EpubControls';
import EpubRenderer from './epub/EpubRenderer';
import EpubNavigation from './epub/EpubNavigation';
import './epub-reader.css';

interface EpubReaderProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const EpubReader = ({ url, title, isOpen, onClose }: EpubReaderProps) => {
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
    exportEpub
  } = useEpubReader({ url, title, isOpen });
  
  const reloadBook = () => {
    window.location.reload();
  };
  
  // تحسين تجربة المستخدم - إغلاق القارئ تلقائياً إذا كان الخطأ شديداً
  useEffect(() => {
    if (error && error.includes("فشل في تحميل الكتاب الإلكتروني")) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // إغلاق بعد 10 ثوانٍ
      
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);
  
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
          <EpubRenderer
            isLoading={isLoading}
            error={error}
            url={url}
            onClose={onClose}
            renditionRef={rendition}
            viewerRef={viewerRef}
            prevPage={prevPage}
            nextPage={nextPage}
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
