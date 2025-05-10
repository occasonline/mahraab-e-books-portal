
import { useState } from "react";
import { NovelFormValues } from "@/schemas/novelSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as pdfjs from 'pdfjs-dist';

// Set the worker source path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFImporterProps {
  onImport: (data: Partial<NovelFormValues>) => void;
  onCancel: () => void;
}

const PDFImporter = ({ onImport, onCancel }: PDFImporterProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if it's a PDF file
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "خطأ في الملف",
          description: "يرجى اختيار ملف بصيغة PDF (.pdf)",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const parsePDF = async (fileData: ArrayBuffer): Promise<Partial<NovelFormValues>> => {
    const result: Partial<NovelFormValues> = {};
    
    try {
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: fileData });
      const pdfDocument = await loadingTask.promise;
      
      // Get total page count
      const numPages = pdfDocument.numPages;
      let fullText = '';
      
      // Extract text from first few pages
      const pagesToExtract = Math.min(5, numPages); // Get text from max 5 pages
      
      for (let i = 1; i <= pagesToExtract; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      // Try to extract title from the first page (assuming it's the largest text)
      const firstPage = await pdfDocument.getPage(1);
      const firstPageContent = await firstPage.getTextContent();
      
      // Get all text items from first page
      const textItems = firstPageContent.items as any[];
      
      // Sort by font size (approximate title extraction)
      textItems.sort((a, b) => {
        const aFontSize = a.transform ? Math.abs(a.transform[3]) : 0;
        const bFontSize = b.transform ? Math.abs(b.transform[3]) : 0;
        return bFontSize - aFontSize;
      });
      
      // Use first largest text item as title if available
      if (textItems.length > 0) {
        result.title = textItems[0].str?.trim() || file?.name.replace('.pdf', '');
      } else {
        result.title = file?.name.replace('.pdf', '');
      }
      
      // Set fullDescription to the extracted text
      result.fullDescription = fullText.trim();
      
      // Set the sample to the first part of the content
      const sampleText = fullText.substring(0, 1000);
      result.sample = sampleText.trim();
      
      // Try to extract author information (simple heuristic: look for "by" or similar text)
      const authorPattern = /(?:by|تأليف|كتابة)\s*:?\s*([^,\n]+)/i;
      const authorMatch = fullText.match(authorPattern);
      if (authorMatch && authorMatch[1]) {
        result.author = authorMatch[1].trim();
      } else {
        result.author = "محراب التوبة";
      }
      
      // Extract a short description (first paragraph after title)
      const paragraphs = fullText.split('\n\n');
      if (paragraphs.length > 1) {
        result.description = paragraphs[1].trim().substring(0, 300);
      } else {
        result.description = fullText.substring(0, 300);
      }
      
      return result;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("فشل في معالجة ملف PDF");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "يرجى اختيار ملف PDF أولاً",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Read the file as ArrayBuffer
      const fileData = await file.arrayBuffer();
      
      if (!fileData || fileData.byteLength === 0) {
        throw new Error("الملف فارغ");
      }
      
      const novelData = await parsePDF(fileData);
      
      // التأكد من وجود البيانات الأساسية
      if (!novelData.title) {
        novelData.title = file.name.replace('.pdf', '');
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
      console.error("Error parsing PDF file:", error);
      toast({
        title: "خطأ في معالجة الملف",
        description: "حدث خطأ أثناء معالجة ملف PDF. تأكد من أن الملف بالتنسيق الصحيح.",
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
          <h3 className="text-lg font-heading font-semibold mb-2">استيراد رواية من ملف PDF</h3>
          <p className="text-muted-foreground text-sm mb-4">
            قم بتحميل ملف PDF (.pdf) ليتم استيراد محتوى الرواية تلقائياً
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-mihrab-beige rounded-lg py-10 px-6 mb-6">
          <Upload className="h-10 w-10 text-mihrab mb-3" />
          
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-muted-foreground mb-3">
              اسحب الملف هنا أو انقر لاختيار ملف
            </p>
            
            <div className="max-w-xs w-full">
              <Label htmlFor="pdf-file" className="sr-only">
                اختر ملف
              </Label>
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
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

export default PDFImporter;
