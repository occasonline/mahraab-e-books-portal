import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ChapterEditor from "./ChapterEditor";
import { novelSchema, NovelFormValues } from "@/schemas/novelSchema";
import { FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getNovelById, createNovel, updateNovel } from "@/services/novelService";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Import the form field components
import NovelBasicFields from "./novel/NovelBasicFields";
import NovelDescriptionFields from "./novel/NovelDescriptionFields";
import NovelCategoryFields from "./novel/NovelCategoryFields";
import NovelTagsField from "./novel/NovelTagsField";
import NovelSampleField from "./novel/NovelSampleField";
import NovelSettingsFields from "./novel/NovelSettingsFields";
import NovelPreview from "./novel/NovelPreview";
import PDFImporter from "./novel/PDFImporter";

interface NovelEditorProps {
  novelId: string | null; // "new" لإضافة رواية جديدة أو معرف الرواية للتعديل
  onCancel: () => void;
  onSave: () => void;
}

const NovelEditor = ({ novelId, onCancel, onSave }: NovelEditorProps) => {
  const [showChapterEditor, setShowChapterEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPDFImporter, setShowPDFImporter] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // تهيئة نموذج التحرير
  const form = useForm<NovelFormValues>({
    resolver: zodResolver(novelSchema),
    defaultValues: {
      title: "",
      author: "محراب التوبة",
      description: "",
      fullDescription: "",
      category: "",
      imageUrl: "",
      tags: [],
      isPremium: false,
      allowDownload: true,
      status: "draft" as const,
      sample: "",
    }
  });

  // استرجاع بيانات الرواية إذا كنا في وضع التعديل
  useEffect(() => {
    const fetchNovelData = async () => {
      if (novelId && novelId !== "new") {
        if (!isSupabaseConfigured()) {
          toast({
            variant: "destructive",
            title: "خطأ في الاتصال بقاعدة البيانات",
            description: "تعذر الاتصال بـ Supabase. يرجى التحقق من إعدادات الاتصال.",
          });
          return;
        }
        
        setLoading(true);
        try {
          const novelData = await getNovelById(novelId);
          
          // تحويل بنية البيانات من قاعدة البيانات إلى بنية النموذج
          form.reset({
            title: novelData.title,
            author: novelData.author,
            description: novelData.description,
            fullDescription: novelData.full_description,
            category: novelData.category,
            imageUrl: novelData.image_url,
            tags: novelData.tags,
            isPremium: novelData.is_premium,
            allowDownload: novelData.allow_download,
            status: novelData.status,
            sample: novelData.sample,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "خطأ في تحميل البيانات",
            description: "لم نتمكن من استرجاع بيانات الرواية. يرجى المحاولة مرة أخرى.",
          });
          console.error("خطأ في استرجاع بيانات الرواية:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNovelData();
  }, [novelId, form, toast]);

  const onSubmit = async (data: NovelFormValues) => {
    // التحقق من اتصال Supabase قبل محاولة الحفظ
    if (!isSupabaseConfigured()) {
      toast({
        variant: "destructive",
        title: "خطأ في حفظ البيانات",
        description: "تعذر الاتصال بقاعدة البيانات Supabase. يرجى التحقق من إعدادات الاتصال من لوحة التحكم.",
      });
      return;
    }
    
    setLoading(true);
    try {
      if (novelId === "new") {
        await createNovel(data);
        toast({
          title: "تم إضافة الرواية",
          description: "تمت إضافة الرواية الجديدة بنجاح",
        });
      } else {
        await updateNovel(novelId!, data);
        toast({
          title: "تم تحديث الرواية",
          description: "تم حفظ التغييرات بنجاح",
        });
      }
      onSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ الرواية. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في حفظ بيانات الرواية:", error);
      setLoading(false);
    }
  };

  // Get form data for preview
  const formValues = form.watch();

  // Handle PDF data import
  const handlePDFData = (data: Partial<NovelFormValues>) => {
    if (data.title) form.setValue("title", data.title);
    if (data.description) form.setValue("description", data.description);
    if (data.fullDescription) form.setValue("fullDescription", data.fullDescription);
    if (data.author) form.setValue("author", data.author);
    if (data.sample) form.setValue("sample", data.sample);
    
    setShowPDFImporter(false);
    
    toast({
      title: "تم استيراد البيانات بنجاح",
      description: "تم استيراد البيانات من الملف وإضافتها إلى نموذج الرواية",
    });
  };

  if (loading && novelId !== "new") {
    return <div className="py-8 text-center">جاري تحميل البيانات...</div>;
  }

  const supabaseConnected = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      {!supabaseConnected && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>تنبيه: لا يوجد اتصال بقاعدة البيانات</AlertTitle>
          <AlertDescription>
            تم اكتشاف مشكلة في الاتصال بـ Supabase. يرجى التأكد من إكمال خطوات الربط من خلال الزر الأخضر Supabase في الأعلى.
            لن تتمكن من حفظ البيانات حتى يتم تكوين الاتصال بشكل صحيح.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold text-mihrab">
          {novelId === "new" ? "إضافة رواية جديدة" : "تعديل الرواية"}
        </h2>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          
          {novelId !== "new" && (
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => setShowChapterEditor(prev => !prev)}
            >
              {showChapterEditor ? "تفاصيل الرواية" : "تحرير الفصول"}
            </Button>
          )}

          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => setShowPreview(prev => !prev)}
          >
            {showPreview ? "إخفاء المعاينة" : "معاينة"}
          </Button>

          {novelId === "new" && (
            <Button 
              variant="outline" 
              className="mr-2 flex items-center gap-2"
              onClick={() => setShowPDFImporter(prev => !prev)}
            >
              <FileText className="h-4 w-4" />
              <span>{showPDFImporter ? "إخفاء المستورد" : "استيراد من ملف"}</span>
            </Button>
          )}
        </div>
      </div>
      
      {showChapterEditor ? (
        <ChapterEditor novelId={novelId!} />
      ) : showPDFImporter ? (
        <PDFImporter onImport={handlePDFData} onCancel={() => setShowPDFImporter(false)} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showPreview && (
              <NovelPreview data={formValues} />
            )}

            <NovelBasicFields form={form} />
            <NovelDescriptionFields form={form} />
            <NovelCategoryFields form={form} />
            <NovelTagsField form={form} />
            <NovelSampleField form={form} />
            <NovelSettingsFields form={form} />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-mihrab hover:bg-mihrab-dark"
                disabled={loading || !supabaseConnected}
              >
                {loading 
                  ? "جاري الحفظ..." 
                  : (novelId === "new" ? "إضافة الرواية" : "حفظ التغييرات")
                }
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default NovelEditor;
