
import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface NovelReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

// Single page component
const Page = React.forwardRef<HTMLDivElement, { content: string; pageNumber: number }>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-mihrab-cream p-8 shadow-md" 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundImage: 'linear-gradient(to right, #f5f3e8, #fffcf0)'
      }}
    >
      {props.pageNumber === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-heading font-bold text-mihrab mb-4 text-center">
            {props.content}
          </h2>
          <p className="text-mihrab-dark/70">انقر على حافة الصفحة للتنقل</p>
        </div>
      ) : (
        <div className="h-full overflow-auto text-right p-4" dir="rtl">
          <p className="text-mihrab-dark leading-relaxed whitespace-pre-line">
            {props.content}
          </p>
          <div className="text-center mt-4 text-mihrab-dark/50">
            {props.pageNumber}
          </div>
        </div>
      )}
    </div>
  );
});

Page.displayName = "Page";

const NovelReader = ({ title, content, isOpen, onClose }: NovelReaderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  
  // Split content into chunks for pages
  const splitContentIntoPages = (text: string): string[] => {
    if (!text) return [];
    
    const charsPerPage = 1000;
    const pages = [];
    
    // Title page
    pages.push(title);
    
    // Content pages
    let remainingText = text;
    while (remainingText.length > 0) {
      // Try to find a good break point (period, paragraph)
      let breakPoint = charsPerPage;
      if (remainingText.length > charsPerPage) {
        // Look for paragraph break
        const paragraphBreak = remainingText.indexOf('\n\n', charsPerPage - 200);
        if (paragraphBreak > 0 && paragraphBreak < charsPerPage + 200) {
          breakPoint = paragraphBreak;
        } else {
          // Look for sentence break
          const sentenceBreak = remainingText.indexOf('. ', charsPerPage - 200);
          if (sentenceBreak > 0 && sentenceBreak < charsPerPage + 200) {
            breakPoint = sentenceBreak + 1;
          }
        }
      } else {
        breakPoint = remainingText.length;
      }
      
      pages.push(remainingText.substring(0, breakPoint));
      remainingText = remainingText.substring(breakPoint);
    }
    
    return pages;
  };
  
  const pages = splitContentIntoPages(content);

  // Navigation functions
  const nextPage = () => {
    if (bookRef.current) {
      (bookRef.current as any).pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      (bookRef.current as any).pageFlip().flipPrev();
    }
  };
  
  const handlePageChange = (e: any) => {
    setCurrentPage(e.data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[80vh] max-h-[800px] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 flex flex-row justify-between items-center">
          <DialogTitle className="text-mihrab text-xl">{title}</DialogTitle>
          <DialogClose className="text-mihrab hover:text-mihrab-dark" />
        </DialogHeader>
        
        <div className="flex-1 relative overflow-hidden bg-mihrab-beige/30">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-full h-full max-w-[900px] max-h-[700px]">
              <HTMLFlipBook
                ref={bookRef}
                width={450}
                height={600}
                size="stretch"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handlePageChange}
                className="book-render"
                startPage={0}
                style={{ padding: '20px' }}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={0}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {pages.map((pageContent, index) => (
                  <Page key={index} content={pageContent} pageNumber={index} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
            <Button 
              onClick={prevPage}
              variant="outline" 
              className="bg-white/80 border-mihrab text-mihrab"
              disabled={currentPage === 0}
            >
              الصفحة السابقة
            </Button>
            <Button 
              onClick={nextPage}
              variant="outline" 
              className="bg-white/80 border-mihrab text-mihrab"
              disabled={currentPage === pages.length - 1}
            >
              الصفحة التالية
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovelReader;
