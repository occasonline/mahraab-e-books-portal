
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { NovelFormValues } from "@/schemas/novelSchema";

interface NovelSampleFieldProps {
  form: UseFormReturn<NovelFormValues>;
}

const NovelSampleField = ({ form }: NovelSampleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="sample"
      render={({ field }) => (
        <FormItem>
          <FormLabel>نموذج القراءة</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="أدخل نموذجًا للقراءة (يمكن للقراء الاطلاع عليه قبل الشراء)" 
              className="min-h-[200px] text-right"
              dir="rtl"
              {...field} 
            />
          </FormControl>
          <FormDescription className="text-right">
            هذا النموذج سيكون متاحًا للقراءة مجانًا للجميع، وهو مهم للروايات الحصرية.
            يُفضل أن يكون النموذج بحجم مناسب (500-1000 كلمة) لجذب انتباه القارئ.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NovelSampleField;
