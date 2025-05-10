
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { NovelFormValues } from "@/schemas/novelSchema";

interface NovelDescriptionFieldsProps {
  form: UseFormReturn<NovelFormValues>;
}

const NovelDescriptionFields = ({ form }: NovelDescriptionFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default NovelDescriptionFields;
