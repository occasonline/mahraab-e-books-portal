
import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EpubRendererProps {
  isLoading: boolean;
  error: string | null;
  url: string;
  onClose: () => void;
  renditionRef: React.MutableRefObject<any>;
  viewerRef: React.MutableRefObject<HTMLDivElement | null>;
  prevPage: () => void;
  nextPage: () => void;
}

const EpubRenderer: React.FC<EpubRendererProps> = ({
  isLoading,
  error,
  url,
  onClose,
  renditionRef,
  viewerRef,
  prevPage,
  nextPage
}) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-mihrab/30 border-t-mihrab rounded-full animate-spin mb-2"></div>
          <p className="text-mihrab-dark dark:text-mihrab-cream">جاري تحميل الكتاب...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <p className="text-mihrab-dark dark:text-mihrab-cream mb-4">
            لم نتمكن من عرض الكتاب الإلكتروني. يرجى التحقق من صحة الملف أو تحميله مرة أخرى.
          </p>
          <div className="text-sm opacity-70 mb-4">
            عنوان URL للكتاب: {url}
          </div>
          <button 
            onClick={onClose}
            className="bg-mihrab/80 text-white hover:bg-mihrab px-4 py-2 rounded"
          >
            إغلاق
          </button>
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
