
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ChapterEditor from "./ChapterEditor";
import { novelSchema, NovelFormValues } from "@/schemas/novelSchema";
import { MOCK_NOVEL } from "@/constants/novelData";

// Import the form field components
import NovelBasicFields from "./novel/NovelBasicFields";
import NovelDescriptionFields from "./novel/NovelDescriptionFields";
import NovelCategoryFields from "./novel/NovelCategoryFields";
import NovelTagsField from "./novel/NovelTagsField";
import NovelSampleField from "./novel/NovelSampleField";
import NovelSettingsFields from "./novel/NovelSettingsFields";
import NovelPreview from "./novel/NovelPreview";

interface NovelEditorProps {
  novelId: string | null; // "new" لإضافة رواية جديدة أو معرف الرواية للتعديل
  onCancel: () => void;
  onSave: () => void;
}

const NovelEditor = ({ novelId, onCancel, onSave }: NovelEditorProps) => {
  const [showChapterEditor, setShowChapterEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // تهيئة نموذج التحرير
  const form = useForm<NovelFormValues>({
    resolver: zodResolver(novelSchema),
    defaultValues: novelId === "new" 
      ? {
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
      : MOCK_NOVEL
  });

  // استرجاع بيانات الرواية إذا كنا في وضع التعديل
  useEffect(() => {
    if (novelId && novelId !== "new") {
      // هنا سيتم استرجاع بيانات الرواية من قاعدة البيانات
      // لأغراض العرض، سنستخدم البيانات المؤقتة
      form.reset(MOCK_NOVEL);
    }
  }, [novelId, form]);

  const onSubmit = async (data: NovelFormValues) => {
    console.log("بيانات الرواية:", data);
    // هنا سيتم إرسال البيانات إلى قاعدة البيانات
    // لأغراض العرض، سننتظر قليلاً ثم ننادي دالة onSave
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave();
  };

  // Get form data for preview
  const formValues = form.watch();

  return (
    <div className="space-y-6">
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
        </div>
      </div>
      
      {showChapterEditor ? (
        <ChapterEditor novelId={novelId!} />
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
              <Button type="submit" className="bg-mihrab hover:bg-mihrab-dark">
                {novelId === "new" ? "إضافة الرواية" : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default NovelEditor;
