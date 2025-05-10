
import * as z from "zod";

// تعريف سكيما التحقق من صحة النموذج
export const novelSchema = z.object({
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

export type NovelFormValues = z.infer<typeof novelSchema>;
