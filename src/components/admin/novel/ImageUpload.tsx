
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Image, Upload } from "lucide-react";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  previewUrl?: string;
  label: string;
}

const ImageUpload = ({ onChange, value, previewUrl, label }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex flex-col items-center">
          <input
            type="file"
            ref={inputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          
          {preview ? (
            <div className="relative w-full mb-4">
              <img
                src={preview}
                alt="صورة الغلاف"
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2 bg-white bg-opacity-70"
                onClick={handleClick}
              >
                تغيير الصورة
              </Button>
            </div>
          ) : (
            <div 
              onClick={handleClick}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Image className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">اضغط لتحميل صورة</p>
              <p className="text-xs text-gray-400">JPG, PNG أو GIF</p>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUpload;
