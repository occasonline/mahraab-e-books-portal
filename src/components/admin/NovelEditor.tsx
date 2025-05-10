import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import ChapterEditor from "./ChapterEditor";

// تعريف سكيما التحقق من صحة النموذج
const novelSchema = z.object({
  title: z.string().min(3, { message: "يجب أن يحتوي العنوان على 3 أحرف على الأقل" }),
  author: z.string().min(2, { message: "يجب إدخال اسم المؤلف" }),
  description: z.string().min(10, { message: "يجب أن يحتوي الوصف على 10 أحرف على الأقل" }),
  fullDescription: z.string().min(50, { message: "يجب أن يحتوي الوصف الكامل على 50 حرف على الأقل" }),
  category: z.string().min(1, { message: "يجب اختيار تصنيف" }),
  imageUrl: z.string().url({ message: "يرجى إدخال رابط صورة صالح" }).or(z.literal("")),
  tags: z.array(z.string()),
  isPremium: z.boolean().default(false),
  allowDownload: z.boolean().default(true),
  status: z.enum(["published", "draft"]),
  sample: z.string().min(1, { message: "يرجى إضافة نموذج قراءة" }),
});

type NovelFormValues = z.infer<typeof novelSchema>;

// بيانات مؤقتة للرواية - سيتم استبدالها بالبيانات من قاعدة البيانات لاحقًا
const MOCK_NOVEL: NovelFormValues = {
  title: "في محراب التوبة",
  author: "محراب التوبة",
  description: "رحلة روحانية في أعماق النفس البشرية، تكشف أسرار التوبة والعودة إلى الذات الحقيقية.",
  fullDescription: "«في محراب التوبة» رواية فلسفية روحانية تأخذ القارئ في رحلة عميقة داخل أغوار النفس البشرية، متتبعة مسار شخصية رئيسية تمر بتحولات جذرية في رؤيتها للعالم والوجود.",
  category: "فلسفي",
  imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  tags: ["روحانية", "فلسفة", "تطوير ذاتي"],
  isPremium: false,
  allowDownload: true,
  status: "published" as const,
  sample: "استيقظ «سالم» على صوت المنبه المزعج كعادته كل صباح. لكن هذا الصباح كان مختلفاً.",
};

// تعريف الفئات المتاحة
const CATEGORIES = [
  { value: "فلسفي", label: "فلسفي" },
  { value: "روحاني", label: "روحاني" },
  { value: "صوفي", label: "صوفي" },
  { value: "نفسي", label: "نفسي" },
  { value: "أدبي", label: "أدبي" },
];

// تعريف الوسوم المتاحة
const AVAILABLE_TAGS = [
  { id: "روحانية", label: "روحانية" },
  { id: "فلسفة", label: "فلسفة" },
  { id: "تطوير ذاتي", label: "تطوير ذاتي" },
  { id: "عرفان", label: "عرفان" },
  { id: "تصوف", label: "تصوف" },
  { id: "أخلاق", label: "أخلاق" },
  { id: "سلوك", label: "سلوك" },
];

interface NovelEditorProps {
  novelId: string | null; // "new" لإضافة رواية جديدة أو معرف الرواية للتعديل
  onCancel: () => void;
  onSave: () => void;
}

const NovelEditor = ({ novelId, onCancel, onSave }: NovelEditorProps) => {
  const [showChapterEditor, setShowChapterEditor] = useState(false);
  
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
        </div>
      </div>
      
      {showChapterEditor ? (
        <ChapterEditor novelId={novelId!} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الرواية</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عنوان الرواية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المؤلف</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم المؤلف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف مختصر</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل وصفًا مختصرًا للرواية (يظهر في القوائم والبطاقات)" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    هذا الوصف يظهر في القوائم وبطاقات الروايات. يُفضل أن يكون موجزًا.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف الكامل</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل وصفًا تفصيليًا للرواية" 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    هذا الوصف يظهر في صفحة تفاصيل الرواية. يمكن أن يكون مفصلاً.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التصنيف</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر تصنيفًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة الغلاف</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رابط صورة الغلاف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>الوسوم</FormLabel>
                    <FormDescription>
                      اختر الوسوم التي تنطبق على هذه الرواية
                    </FormDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <FormField
                        key={tag.id}
                        control={form.control}
                        name="tags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tag.id}
                              className="flex flex-row items-center space-x-3 space-x-reverse space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, tag.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== tag.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {tag.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sample"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نموذج القراءة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل نموذجًا للقراءة (مقدمة الرواية أو مقتطف منها)" 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    هذا النموذج سيظهر للقراء في قسم "نموذج القراءة" في صفحة الرواية.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>رواية حصرية</FormLabel>
                      <FormDescription>
                        هل هذه رواية حصرية للأعضاء المدفوعين فقط؟
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allowDownload"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>السماح بالتحميل</FormLabel>
                      <FormDescription>
                        هل تريد السماح للقراء بتحميل هذه الرواية؟
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حالة النشر</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة النشر" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="published">منشورة</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    الروايات المنشورة ستظهر للزوار، بينما المسودات لن تظهر.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
