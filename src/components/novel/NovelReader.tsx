
import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, Download } from "lucide-react"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
          <p className="text-mihrab-dark/70 text-center">انقر على حافة الصفحة للتنقل</p>
        </div>
      ) : (
        <div 
          className="h-full overflow-auto text-right p-4" 
          dir="rtl"
          lang="ar"
          style={{
            fontFeatureSettings: "'kern', 'liga', 'calt', 'rlig'",
            textRendering: "optimizeLegibility",
            fontFamily: "Amiri, serif"
          }}
        >
          <p className="text-mihrab-dark leading-relaxed whitespace-pre-line font-amiri">
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
    
    const charsPerPage = 800; // Reduced characters per page for better readability
    const pages = [];
    
    // Title page
    pages.push(title);
    
    // Split by paragraphs first
    const paragraphs = text.split('\n\n');
    let currentPageContent = '';
    
    // Group paragraphs into pages
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      if (!paragraph) continue;
      
      if ((currentPageContent + paragraph).length > charsPerPage && currentPageContent.length > 0) {
        // Current page is full, add it to pages and start a new one
        pages.push(currentPageContent.trim());
        currentPageContent = paragraph + '\n\n';
      } else {
        // Add paragraph to current page
        currentPageContent += (currentPageContent ? '\n\n' : '') + paragraph;
      }
    }
    
    // Add the last page if not empty
    if (currentPageContent.trim()) {
      pages.push(currentPageContent.trim());
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

  // Export functions
  const exportToWord = () => {
    // Create Blob with HTML content properly formatted for Word
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${title}</title>
        <style>
          @font-face {
            font-family: 'Amiri';
            src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          }
          body { 
            font-family: 'Amiri', 'Arial', sans-serif; 
            text-align: right; 
            direction: rtl; 
            padding: 40px;
          }
          h1 { 
            color: #7A6C5D; 
            text-align: center; 
            font-size: 24pt; 
            margin-bottom: 50px; 
          }
          p { 
            line-height: 1.6; 
            font-size: 12pt; 
            text-align: right;
            direction: rtl;
          }
          .page-break { 
            page-break-after: always; 
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
      </body>
      </html>
    `;
    
    // Use application/msword for better compatibility
    const blob = new Blob([htmlContent], {type: 'application/msword'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Create a properly formatted HTML for PDF with RTL support
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          @font-face {
            font-family: 'Amiri';
            src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          }
          body { 
            font-family: 'Amiri', 'Arial', sans-serif; 
            text-align: right; 
            direction: rtl; 
            padding: 20px;
          }
          h1 { 
            color: #7A6C5D; 
            text-align: center; 
            font-size: 24pt; 
            margin-bottom: 50px; 
          }
          p { 
            line-height: 1.6; 
            font-size: 12pt; 
            text-align: right;
            direction: rtl;
          }
          .page-break { 
            page-break-after: always; 
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], {type: 'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[80vh] max-h-[800px] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 flex flex-row justify-between items-center">
          <DialogTitle className="text-mihrab text-xl font-amiri">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToWord}>
                  تنزيل بصيغة Word
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  تنزيل بصيغة PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogClose className="text-mihrab hover:text-mihrab-dark" />
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-center text-xs pt-0 mt-0">
          استخدم الأزرار أسفل الكتاب أو انقر على جانبي الصفحة للتنقل بين الصفحات
        </DialogDescription>
        
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
              className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1"
              disabled={currentPage === 0}
            >
              <ChevronRight size={16} />
              الصفحة السابقة
            </Button>
            <Button 
              onClick={nextPage}
              variant="outline" 
              className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1"
              disabled={currentPage === pages.length - 1}
            >
              الصفحة التالية
              <ChevronLeft size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovelReader;
