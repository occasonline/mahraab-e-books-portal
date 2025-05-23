
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Type, Download, RotateCcw, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EpubControlsProps {
  title: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  changeFontSize: (increment: boolean) => void;
  exportEpub: () => void;
  reloadBook?: () => void;
  isLoading?: boolean;
}

const EpubControls: React.FC<EpubControlsProps> = ({
  title,
  isDarkMode,
  toggleDarkMode,
  changeFontSize,
  exportEpub,
  reloadBook,
  isLoading = false
}) => {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2">
      <h2 className="text-mihrab text-xl font-amiri dark:text-mihrab-cream flex items-center">
        {title}
        {isLoading && (
          <div className="flex items-center text-sm opacity-70 mr-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري التحميل...
          </div>
        )}
      </h2>
      <div className="flex items-center gap-2">
        {reloadBook && (
          <Button
            variant="outline"
            size="icon"
            onClick={reloadBook}
            title="إعادة تحميل الكتاب"
            disabled={isLoading}
          >
            <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleDarkMode}
          title={isDarkMode ? "وضع النهار" : "الوضع المظلم"}
          disabled={isLoading}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => changeFontSize(false)}
          title="تصغير الخط"
          disabled={isLoading}
        >
          <Type className="h-3 w-3" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => changeFontSize(true)}
          title="تكبير الخط"
          disabled={isLoading}
        >
          <Type className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportEpub} disabled={isLoading}>
              تنزيل ملف EPUB
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EpubControls;
