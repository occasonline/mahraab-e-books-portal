import React, { useState, useRef, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, Download, Moon, Sun, Type } from "lucide-react"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import './flip-rtl.css';

interface NovelReaderProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

// Single page component
const Page = React.forwardRef<HTMLDivElement, { content: string; pageNumber: number; fontSize: string }>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-mihrab-cream p-4 shadow-md dark:bg-mihrab-dark dark:text-white"
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundImage: 'linear-gradient(to right, #f5f3e8, #fffcf0)',
      }}
    >
      <div
        className="h-full overflow-hidden"
        dir="rtl" 
        lang="ar"
      >
        {props.pageNumber === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className={`text-3xl font-amiri font-bold text-mihrab mb-4 text-center dark:text-mihrab-cream`}>
              {props.content}
            </h2>
            <p className="text-mihrab-dark/70 text-center font-amiri dark:text-mihrab-cream/70">انقر على حافة الصفحة للتنقل</p>
          </div>
        ) : (
          <div className="h-full overflow-hidden flex flex-col">
            <div className={`flex-1 overflow-hidden leading-relaxed font-amiri text-mihrab-dark ${props.fontSize} dark:text-mihrab-cream`}>
              <ReactMarkdown>{props.content}</ReactMarkdown>
            </div>
            <span className="self-end pr-4 pb-4 text-sm opacity-60 dark:text-mihrab-cream/60">{props.pageNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
});

Page.displayName = "Page";

const NovelReader = ({ title, content, isOpen, onClose }: NovelReaderProps) => {
  const STORAGE_KEY = `novel-reader-${title}`;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<string>("text-lg");
  const bookRef = useRef(null);
  const measureRef = useRef<HTMLDivElement>(null);
  
  // تقسيم المحتوى إلى صفحات مع استخدام القياس الفعلي للنص
  const splitContentIntoPages = useMemo(() => {
    if (!content) return [];
    
    const pages = [];
    
    // صفحة العنوان
    pages.push(title);
    
    // قياس النص وتقسيمه حسب المساحة الفعلية
    if (measureRef.current) {
      // تنظيف النص وتعيين إعدادات القياس
      const textToMeasure = content.trim();
      measureRef.current.className = `font-amiri ${fontSize} invisible fixed top-0 left-0 right-0 overflow-hidden p-4`;
      measureRef.current.style.width = "450px"; // تعيين العرض ليناسب الصفحة
      
      // العوامل المؤثرة على تقسيم المحتوى
      const PAGE_HEIGHT_PX = 550; // تقدير أولي لارتفاع الصفحة (يمكن ضبطه)
      
      // تقسيم المحتوى حسب الفقرات أولاً
      const paragraphs = textToMeasure.split('\n\n');
      let currentPageContent = '';
      
      // معالجة كل فقرة
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        if (!paragraph) continue;
        
        // قياس محتوى الصفحة الحالية + الفقرة الجديدة
        const testContent = currentPageContent + (currentPageContent ? '\n\n' : '') + paragraph;
        measureRef.current.innerHTML = testContent;
        
        // فحص هل التفاع تجاوز حد الصفحة
        if (measureRef.current.scrollHeight > PAGE_HEIGHT_PX && currentPageContent.length > 0) {
          // حفظ الصفحة الحالية وبدء صفحة جديدة
          pages.push(currentPageContent);
          currentPageContent = paragraph;
        } else {
          // إضافة الفقرة للصفحة الحالية
          currentPageContent = testContent;
        }
        
        // العمل مع علامات فاصل الصفحات اليدوية
        if (paragraph.includes('<!-- pagebreak -->')) {
          const parts = paragraph.split('<!-- pagebreak -->');
          // إضافة النص قبل الفاصل إلى الصفحة الحالية
          const beforeBreak = parts.shift()?.trim();
          if (beforeBreak) {
            currentPageContent = (currentPageContent || '') + beforeBreak;
          }
          
          // حفظ الصفحة الحالية
          pages.push(currentPageContent);
          
          // بدء صفحة جديدة بالنص بعد الفاصل
          currentPageContent = parts.join('\n\n').trim();
        }
      }
      
      // إضافة الصفحة الأخيرة إذا بقي محتوى
      if (currentPageContent) {
        pages.push(currentPageContent);
      }
    } else {
      // خطة بديلة إذا لم يكن عنصر القياس جاهزًا
      const charsPerPage = 350; // تقليل عدد الأحرف للصفحة الواحدة لزيادة عدد الصفحات
      
      // تقسيم حسب الفقرات
      const paragraphs = content.split('\n\n');
      let currentPageContent = '';
      
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        if (!paragraph) continue;
        
        if ((currentPageContent.length + paragraph.length) > charsPerPage && currentPageContent.length > 0) {
          pages.push(currentPageContent.trim());
          currentPageContent = paragraph;
        } else {
          currentPageContent += (currentPageContent ? '\n\n' : '') + paragraph;
        }
      }
      
      if (currentPageContent.trim()) {
        pages.push(currentPageContent.trim());
      }
    }
    
    console.log('Total pages created:', pages.length);
    console.log('Content length:', content.length);
    console.log('First page preview:', pages[0]?.substring(0, 50));
    return pages;
  }, [content, title, fontSize]);
  
  // نستخدم الصفحات مباشرة بدون أي قصّ أو تعديل
  const pages = splitContentIntoPages;
  
  // سجل عدد الصفحات التي يتم تمريرها إلى HTMLFlipBook للتحقق
  useEffect(() => {
    console.log('Children passed to FlipBook:', pages.length);
  }, [pages]);

  // ضبط عدد الصفحات الإجمالي وتحميل الصفحة المحفوظة
  useEffect(() => {
    setTotalPages(pages.length);
    
    // تحميل الصفحة المحفوظة من localStorage
    const savedPage = localStorage.getItem(STORAGE_KEY);
    if (savedPage !== null) {
      const pageNum = parseInt(savedPage, 10);
      // التحقق من أن رقم الصفحة ضمن الحدود
      if (!isNaN(pageNum) && pageNum >= 0 && pageNum < pages.length) {
        setCurrentPage(pageNum);
        // الانتقال إلى الصفحة المحفوظة بعد تأخير بسيط للتأكد من جاهزية الكتاب
        setTimeout(() => {
          if (bookRef.current) {
            (bookRef.current as any).pageFlip().flip(pageNum);
          }
        }, 300);
      }
    }
    
    // التحقق من تفضيل النظام للوضع الداكن
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
  }, [pages, STORAGE_KEY]);

  // معالجة حدث تغيير الصفحة
  const handlePageChange = (e: any) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    // حفظ الصفحة الحالية في localStorage
    localStorage.setItem(STORAGE_KEY, newPage.toString());
  };

  // وظائف التنقل
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

  const goToPage = (pageNumber: number) => {
    if (bookRef.current) {
      (bookRef.current as any).pageFlip().flip(pageNumber);
    }
  };

  // وظيفة تبديل الوضع الداكن
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // وظيفة تبديل حجم الخط
  const toggleFontSize = () => {
    // التنقل بين أحجام الخطوط
    setFontSize(current => {
      if (current === "text-lg") return "text-xl";
      if (current === "text-xl") return "text-2xl";
      return "text-lg";
    });
  };

  // حساب النسبة المئوية لتقدم القراءة
  const progressPercentage = totalPages > 1 
    ? Math.round((currentPage / (totalPages - 1)) * 100)
    : 0;

  // وظائف التصدير
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

  // إنشاء عناصر الترقيم
  const renderPagination = () => {
    const items = [];
    const maxDisplayedPages = 7;
    
    // أضف الصفحة الأولى
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 0}
          onClick={() => goToPage(0)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // إذا كان رقم الصفحة أكبر من 3، أضف علامة الترقيم
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // أضف الصفحات المحيطة بالصفحة الحالية
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 3);
    
    for (let i = start; i < end; i++) {
      if (i === 0) continue; // أغلب الصفحة الأولى مسبوقة بالعلامة الترقيم
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => goToPage(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // إذا كان رقم الصفحة أكبر من 3، أضف علامة الترقيم
    if (end < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // إذا لم تكن الصفحة الأخيرة مضافرة، أضفها
    if (totalPages > 1 && end !== totalPages - 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages - 1}
            onClick={() => goToPage(totalPages - 1)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // الحصول على رقم الصفحة الحقيقي
  const getRealPageNumber = (index: number) => {
    return index + 1; // تصحيح ترقيم الصفحات من 1 بدلاً من عكسها
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
              onClick={toggleFontSize}
              title="تغيير حجم الخط"
            >
              <Type className="h-4 w-4" />
            </Button>
            
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
            <DialogClose className="text-mihrab hover:text-mihrab-dark dark:text-mihrab-cream dark:hover:text-white" />
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-center text-xs pt-0 mt-0 dark:text-mihrab-cream/70">
          استخدم الأزرار أسفل الكتاب أو انقر على جانبي الصفحة للتنقل بين الصفحات
        </DialogDescription>
        
        {/* منطقة قياس النص - مخفية */}
        <div 
          ref={measureRef} 
          className="invisible absolute top-0 left-0 right-0" 
          aria-hidden="true"
        ></div>
        
        <div className="flex-1 relative overflow-hidden bg-mihrab-beige/30 dark:bg-mihrab-dark/60">
          <div dir="rtl" className="absolute inset-0 flex justify-center items-center">
            <div className="w-full h-full max-w-[900px] max-h-[700px] book-rtl">
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
                startPage={currentPage}
                style={{ padding: '20px' }}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={false}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={0}
                showPageCorners={true}
                disableFlipByClick={false}
                renderOnlyPageLengthChange={false}
              >
                {pages.map((pageContent, index) => (
                  <Page 
                    key={index} 
                    content={pageContent} 
                    pageNumber={getRealPageNumber(index)} 
                    fontSize={fontSize} 
                  />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
          
          {/* أزرار التنقل على جانبي الكتاب */}
          <button 
            onClick={prevPage} 
            className="flip-btn flip-btn-right dark:bg-mihrab-dark/50 dark:hover:bg-mihrab-dark/70"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="h-6 w-6 text-mihrab dark:text-mihrab-cream" />
          </button>
          
          <button 
            onClick={nextPage} 
            className="flip-btn flip-btn-left dark:bg-mihrab-dark/50 dark:hover:bg-mihrab-dark/70"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="h-6 w-6 text-mihrab dark:text-mihrab-cream" />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
            <div className="text-mihrab-dark bg-white/80 px-3 py-1 rounded-full text-sm dark:bg-mihrab-dark/80 dark:text-white">
              الصفحة {getRealPageNumber(currentPage)} من {totalPages}
            </div>
            
            {/* شريط التقدم */}
            <div className="w-64 mx-auto px-4">
              <Progress 
                value={progressPercentage} 
                className="h-2 dark:bg-mihrab-dark" 
              />
              <div className="text-xs text-center mt-1 text-mihrab-dark/70 dark:text-mihrab-cream/70">
                {progressPercentage}% مقروء
              </div>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={nextPage}
                    className="flex flex-row-reverse"
                    aria-label="الصفحة التالية"
                  />
                </PaginationItem>
                
                {renderPagination()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={prevPage}
                    className="flex flex-row-reverse"
                    aria-label="الصفحة السابقة"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="flex justify-center gap-8">
              <Button 
                onClick={prevPage}
                variant="outline" 
                className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1 dark:bg-mihrab-dark/80 dark:text-white dark:border-mihrab-cream"
                disabled={currentPage === 0}
              >
                <ChevronRight size={16} />
                الصفحة السابقة
              </Button>
              <Button 
                onClick={nextPage}
                variant="outline" 
                className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1 dark:bg-mihrab-dark/80 dark:text-white dark:border-mihrab-cream"
                disabled={currentPage === pages.length - 1}
              >
                الصفحة التالية
                <ChevronLeft size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovelReader;
