
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

interface SimpleEpubViewerProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const SimpleEpubViewer: React.FC<SimpleEpubViewerProps> = ({
  url,
  title,
  isOpen,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const loadEpub = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // تحميل مكتبة epub.js بشكل ديناميكي
        const ePub = await import('epubjs');
        
        // إنشاء الكتاب
        const book = ePub.default(url);
        
        // إنشاء العرض بأبسط الإعدادات
        const rendition = book.renderTo(containerRef.current, {
          width: '100%',
          height: '100%'
        });
        
        // عرض الكتاب
        await rendition.display();
        
        setIsLoading(false);
        
        // إضافة مستمعات الأحداث للتنقل
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') rendition.next();
          if (e.key === 'ArrowRight') rendition.prev();
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
          rendition.destroy();
        };
        
      } catch (err) {
        console.error('فشل في تحميل الكتاب:', err);
        setError('فشل في تحميل الكتاب الإلكتروني');
        setIsLoading(false);
      }
    };

    loadEpub();
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      {/* شريط التحكم العلوي */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button onClick={onClose}>إغلاق</Button>
        </div>
      </div>

      {/* منطقة العرض */}
      <div className="flex-1 relative" style={{ height: 'calc(100vh - 80px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>جاري تحميل الكتاب...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="text-lg mb-4">{error}</p>
              <Button onClick={onClose}>إغلاق</Button>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className={`w-full h-full ${isDarkMode ? 'dark' : ''}`}
          style={{ direction: 'rtl' }}
        />
      </div>
    </div>
  );
};

export default SimpleEpubViewer;
