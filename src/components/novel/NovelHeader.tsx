
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Novel } from "@/types/supabase";
import { formatArabicDate } from '@/lib/dateUtils';
import NovelCover from "./NovelCover";
import NovelRating from "./NovelRating";
import NovelReader from "./NovelReader";

interface NovelHeaderProps {
  novel: Novel;
  onStartReading: () => void;
  onDownload: (format: string) => void;
  onOpenEpubReader?: () => void;
  hasEpub?: boolean;
}

const NovelHeader = ({ 
  novel, 
  onStartReading, 
  onDownload, 
  onOpenEpubReader,
  hasEpub = false
}: NovelHeaderProps) => {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:w-1/3 p-6">
          <NovelCover 
            imageUrl={novel.image_url} 
            title={novel.title} 
            isPremium={novel.is_premium} 
          />
        </div>
        
        <div className="md:w-2/3 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-mihrab mb-2 text-right">
            {novel.title}
          </h1>
          <p className="text-mihrab-dark/70 mb-4 text-right">تأليف: {novel.author}</p>
          
          <div className="flex items-center mb-4 justify-end">
            <span className="ml-2 text-mihrab-dark/70">
              4.5/5 (3 تقييمات)
            </span>
            <NovelRating rating={4.5} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 justify-end">
            <span className="bg-mihrab bg-opacity-10 text-mihrab-dark text-xs px-3 py-1 rounded-full">
              {novel.category}
            </span>
            {novel.tags?.map((tag, index) => (
              <span key={index} className="bg-mihrab-beige text-mihrab-dark text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-mihrab-dark/90 leading-relaxed mb-6 text-right">
            {novel.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
              <p className="text-xs text-mihrab-dark/70">تاريخ النشر</p>
              <p className="font-bold text-mihrab-dark">
                {novel.created_at ? formatArabicDate(novel.created_at) : ''}
              </p>
            </div>
            <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
              <p className="text-xs text-mihrab-dark/70">الحالة</p>
              <p className="font-bold text-mihrab-dark">
                {novel.status === 'published' ? 'منشورة' : 'مسودة'}
              </p>
            </div>
            <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
              <p className="text-xs text-mihrab-dark/70">التصنيف</p>
              <p className="font-bold text-mihrab-dark">{novel.category}</p>
            </div>
            <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
              <p className="text-xs text-mihrab-dark/70">التقييم</p>
              <p className="font-bold text-mihrab-dark">4.5/5</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-end">
            <div className="relative group">
              <Button variant="outline" className="border-mihrab text-mihrab hover:bg-mihrab-cream min-w-40">
                تحميل
              </Button>
              <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                <button 
                  onClick={() => onDownload('PDF')}
                  className="w-full text-right px-4 py-2 hover:bg-mihrab-cream text-sm text-mihrab-dark"
                >
                  PDF تحميل
                </button>
                <button 
                  onClick={() => onDownload('EPUB')}
                  className="w-full text-right px-4 py-2 hover:bg-mihrab-cream text-sm text-mihrab-dark"
                >
                  EPUB تحميل
                </button>
              </div>
            </div>
            
            {hasEpub && onOpenEpubReader ? (
              <Button 
                onClick={onOpenEpubReader}
                className="bg-mihrab-gold hover:bg-mihrab-gold/80 min-w-40"
              >
                قراءة بتنسيق EPUB
              </Button>
            ) : (
              <Button 
                onClick={() => setIsReaderOpen(true)}
                className="bg-mihrab-gold hover:bg-mihrab-gold/80 min-w-40"
              >
                قراءة بتأثير الكتاب
              </Button>
            )}
            
            <Button 
              onClick={onStartReading}
              className="bg-mihrab hover:bg-mihrab-dark min-w-40"
            >
              ابدأ القراءة
            </Button>
          </div>
        </div>
      </div>
      
      {/* Novel Flip Book Reader */}
      <NovelReader 
        title={novel.title}
        content={novel.sample || ''}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
      />
    </div>
  );
};

export default NovelHeader;
