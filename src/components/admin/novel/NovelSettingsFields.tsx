
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { NovelFormValues } from "@/schemas/novelSchema";

interface NovelSettingsFieldsProps {
  form: UseFormReturn<NovelFormValues>;
}

const NovelSettingsFields = ({ form }: NovelSettingsFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default NovelSettingsFields;
