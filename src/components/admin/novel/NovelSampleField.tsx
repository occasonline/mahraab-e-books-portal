
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
  );
};

export default NovelSampleField;
