
import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EpubRendererProps {
  isLoading: boolean;
  error: string | null;
  url: string;
  onClose: () => void;
  renditionRef: React.MutableRefObject<any>;
  viewerRef: React.MutableRefObject<HTMLDivElement | null>;
  prevPage: () => void;
  nextPage: () => void;
  reloadBook: () => void;
}

const EpubRenderer: React.FC<EpubRendererProps> = ({
  isLoading,
  error,
  url,
  onClose,
  renditionRef,
  viewerRef,
  prevPage,
  nextPage,
  reloadBook
}) => {
  const handleReloadClick = () => {
    console.log("طلب إعادة تحميل الكتاب من EpubRenderer");
    reloadBook();
  };
  
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white/80 dark:bg-mihrab-dark/80 p-8 rounded-lg shadow-lg">
          <div className="inline-block w-12 h-12 border-4 border-mihrab/30 border-t-mihrab rounded-full animate-spin mb-4"></div>
          <p className="text-mihrab-dark dark:text-mihrab-cream text-lg mb-2">جاري تحميل الكتاب...</p>
          <p className="text-mihrab-dark/70 dark:text-mihrab-cream/70 text-sm mb-4">
            قد يستغرق التحميل بضع ثوانٍ للكتب الكبيرة
          </p>
          <div className="text-xs text-mihrab-dark/50 dark:text-mihrab-cream/50 mt-4 max-w-xs mx-auto">
            إذا استمر التحميل لفترة طويلة، يمكنك إعادة المحاولة أو استخدام ملف آخر
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 max-w-md bg-white dark:bg-mihrab-dark rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <p className="text-mihrab-dark dark:text-mihrab-cream mb-4">
            لم نتمكن من عرض الكتاب الإلكتروني. يرجى التحقق من صحة الملف أو تحميله مرة أخرى.
          </p>
          <div className="text-sm opacity-70 mb-4 overflow-auto max-h-24 p-2 bg-gray-100 dark:bg-gray-800 rounded break-all">
            <code dir="ltr" className="text-xs">الملف: {url}</code>
          </div>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleReloadClick}
              variant="outline"
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4 ml-1" />
              إعادة تحميل
            </Button>
            <Button 
              onClick={onClose}
              variant="default"
              className="bg-mihrab/80 text-white hover:bg-mihrab"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
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
  );
};

export default EpubRenderer;
