
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EpubNavigationProps {
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  prevPage: () => void;
  nextPage: () => void;
  isLoading?: boolean;
}

const EpubNavigation: React.FC<EpubNavigationProps> = ({
  currentPage,
  totalPages,
  progressPercentage,
  prevPage,
  nextPage,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="absolute bottom-4 left-0 right-0 px-8">
        <div className="bg-white/90 dark:bg-mihrab-dark/90 rounded-full py-3 px-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-mihrab-dark/70 dark:text-mihrab-cream/70">
              جاري التحميل...
            </div>
            
            <div className="text-sm font-medium text-mihrab-dark dark:text-mihrab-cream">
              تحضير الكتاب
            </div>
          </div>
          
          <Progress 
            value={20} 
            className="h-2 dark:bg-mihrab-dark animate-pulse" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-0 right-0 px-8">
      <div className="bg-white/90 dark:bg-mihrab-dark/90 rounded-full py-3 px-5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-mihrab-dark/70 dark:text-mihrab-cream/70">
            {progressPercentage}%
          </div>
          
          <div className="text-sm font-medium text-mihrab-dark dark:text-mihrab-cream">
            الصفحة {currentPage} من {totalPages || "؟"}
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
            disabled={currentPage <= 1}
          >
            <ChevronRight size={16} />
            الصفحة السابقة
          </Button>
          <Button 
            onClick={nextPage}
            variant="outline" 
            className="bg-white/80 border-mihrab text-mihrab flex items-center gap-1 dark:bg-mihrab-dark/80 dark:text-white dark:border-mihrab-cream"
            disabled={currentPage >= totalPages && totalPages > 0}
          >
            الصفحة التالية
            <ChevronLeft size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpubNavigation;
