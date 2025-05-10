
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Type, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EpubControlsProps {
  title: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  changeFontSize: (increment: boolean) => void;
  exportEpub: () => void;
}

const EpubControls: React.FC<EpubControlsProps> = ({
  title,
  isDarkMode,
  toggleDarkMode,
  changeFontSize,
  exportEpub
}) => {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2">
      <h2 className="text-mihrab text-xl font-amiri dark:text-mihrab-cream">{title}</h2>
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
          onClick={() => changeFontSize(false)}
          title="تصغير الخط"
        >
          <Type className="h-3 w-3" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => changeFontSize(true)}
          title="تكبير الخط"
        >
          <Type className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportEpub}>
              تنزيل ملف EPUB
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EpubControls;
