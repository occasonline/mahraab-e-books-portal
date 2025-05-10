
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { NovelFormValues } from "@/schemas/novelSchema";
import { NOVEL_CATEGORIES } from "@/constants/novelData";
import ImageUpload from "./ImageUpload";

interface NovelCategoryFieldsProps {
  form: UseFormReturn<NovelFormValues>;
}

const NovelCategoryFields = ({ form }: NovelCategoryFieldsProps) => {
  // Helper function to handle image upload
  const handleImageUpload = (file: File | null) => {
    if (file) {
      // Store the file in the form
      form.setValue("coverImage", file);
      
      // Create a local URL for preview purposes only
      const objectUrl = URL.createObjectURL(file);
      form.setValue("imageUrl", objectUrl);
    }
  };

  // Get the current values from the form
  const imageUrl = form.watch("imageUrl");
  const coverImage = form.watch("coverImage");

  return (
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
                {NOVEL_CATEGORIES.map((category) => (
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
        name="coverImage"
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <ImageUpload
            onChange={handleImageUpload}
            value={coverImage || null}
            previewUrl={imageUrl}
            label="صورة الغلاف"
            {...fieldProps}
          />
        )}
      />
    </div>
  );
};

export default NovelCategoryFields;
