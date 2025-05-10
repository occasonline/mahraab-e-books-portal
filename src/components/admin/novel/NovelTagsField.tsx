
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { NovelFormValues } from "@/schemas/novelSchema";
import { NOVEL_TAGS } from "@/constants/novelData";

interface NovelTagsFieldProps {
  form: UseFormReturn<NovelFormValues>;
}

const NovelTagsField = ({ form }: NovelTagsFieldProps) => {
  return (
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
            {NOVEL_TAGS.map((tag) => (
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
  );
};

export default NovelTagsField;
