
import { useState } from "react";
import { NovelFormValues } from "@/schemas/novelSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MarkdownImporterProps {
  onImport: (data: Partial<NovelFormValues>) => void;
  onCancel: () => void;
}

const MarkdownImporter = ({ onImport, onCancel }: MarkdownImporterProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if it's a markdown file
      if (!selectedFile.name.toLowerCase().endsWith('.md')) {
        toast({
          title: "خطأ في الملف",
          description: "يرجى اختيار ملف بصيغة Markdown (.md)",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const parseMarkdown = async (content: string): Promise<Partial<NovelFormValues>> => {
    // Enhanced parsing logic with proper null/undefined checks
    const lines = content.split('\n');
    let result: Partial<NovelFormValues> = {};
    
    // Try to extract title from the first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      result.title = titleMatch[1].trim();
    }
    
    // Try to extract author information
    const authorMatch = content.match(/author:\s*(.+)$/im) || content.match(/by\s*(.+)$/im);
    if (authorMatch && authorMatch[1]) {
      result.author = authorMatch[1].trim();
    }
    
    // Extract description - assuming it's after the title but before other sections
    const descriptionMatch = content.match(/^([^#].+?)(?=\n#|\n\n#|\n\n\n)/s);
    if (descriptionMatch && descriptionMatch[1]) {
      const description = descriptionMatch[1].trim();
      
      // Use the first paragraph as short description
      result.description = description.split('\n\n')[0] || description;
    }
    
    // Set the full content as fullDescription
    // Remove potential metadata from the top (like title, author)
    let fullContent = content;
    if (titleMatch && titleMatch[0]) {
      fullContent = fullContent.replace(titleMatch[0], '').trim();
    }
    
    // Remove potential YAML frontmatter if present
    fullContent = fullContent.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    
    // Set the fullDescription to the entire processed content
    result.fullDescription = fullContent || "";
    
    // Look for a sample section or extract first portion
    const sampleMatch = content.match(/##\s+(?:نموذج|عينة|مقتطف)\s*\n([\s\S]+?)(?=\n##|$)/i);
    if (sampleMatch && sampleMatch[1]) {
      result.sample = sampleMatch[1].trim();
    } else {
      // If no explicit sample, take a portion from the beginning of the text
      const contentWithoutHeadings = content.replace(/^#.*$/gm, '').trim();
      if (contentWithoutHeadings.length > 100) {
        // Take first 500 characters or first few paragraphs as sample
        const firstParagraphs = contentWithoutHeadings.split('\n\n').slice(0, 2).join('\n\n');
        result.sample = firstParagraphs.length > 500 
          ? firstParagraphs.substring(0, 500) + '...' 
          : firstParagraphs;
      } else {
        result.sample = contentWithoutHeadings || "لا يوجد نموذج";
      }
    }
    
    return result;
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "يرجى اختيار ملف Markdown أولاً",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await file.text();
      
      if (!content || content.trim() === '') {
        throw new Error("الملف فارغ");
      }
      
      const novelData = await parseMarkdown(content);
      
      // التأكد من وجود البيانات الأساسية
      if (!novelData.title) {
        novelData.title = file.name.replace('.md', '');
      }
      
      if (!novelData.author) {
        novelData.author = "محراب التوبة";
      }
      
      if (!novelData.description) {
        novelData.description = "وصف مختصر للرواية";
      }
      
      if (!novelData.sample) {
        novelData.sample = "لا يوجد نموذج قراءة";
      }
      
      toast({
        title: "تم استيراد الملف بنجاح",
        description: `تم استيراد البيانات من ملف ${file.name}`,
      });
      
      onImport(novelData);
    } catch (error) {
      console.error("Error parsing markdown file:", error);
      toast({
        title: "خطأ في معالجة الملف",
        description: "حدث خطأ أثناء معالجة ملف Markdown. تأكد من أن الملف بالتنسيق الصحيح.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-heading font-semibold mb-2">استيراد رواية من ملف Markdown</h3>
          <p className="text-muted-foreground text-sm mb-4">
            قم بتحميل ملف Markdown (.md) ليتم استيراد محتوى الرواية تلقائياً
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-mihrab-beige rounded-lg py-10 px-6 mb-6">
          <Upload className="h-10 w-10 text-mihrab mb-3" />
          
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-muted-foreground mb-3">
              اسحب الملف هنا أو انقر لاختيار ملف
            </p>
            
            <div className="max-w-xs w-full">
              <Label htmlFor="markdown-file" className="sr-only">
                اختر ملف
              </Label>
              <Input
                id="markdown-file"
                type="file"
                accept=".md"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {file && (
              <div className="mt-4 text-sm">
                <span className="font-semibold">الملف المختار:</span> {file.name}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleImport}
            className="bg-mihrab hover:bg-mihrab-dark"
            disabled={!file || isLoading}
          >
            {isLoading ? "جاري المعالجة..." : "استيراد البيانات"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownImporter;
