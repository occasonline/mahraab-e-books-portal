
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NovelCoverProps {
  imageUrl: string | null;
  title: string;
  isPremium?: boolean;
}

const NovelCover = ({ imageUrl, title, isPremium }: NovelCoverProps) => {
  // معالجة الصورة بشكل أفضل مع حالة خطأ التحميل
  const getCoverImageUrl = () => {
    if (imageUrl && imageUrl.trim() !== "") {
      return imageUrl;
    }
    // استخدام صورة احتياطية
    return "/placeholder.svg";
  };
  
  return (
    <div className="relative aspect-[3/4] max-w-xs mx-auto">
      <AspectRatio ratio={3/4}>
        <img 
          src={getCoverImageUrl()} 
          alt={title}
          className="w-full h-full object-cover rounded-lg shadow-md"
          onError={(e) => {
            // If image fails to load, set to placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = "/placeholder.svg";
          }}
        />
      </AspectRatio>
      {isPremium && (
        <div className="absolute top-4 right-4 bg-mihrab-gold text-white text-xs font-bold px-3 py-1 rounded-full">
          حصري
        </div>
      )}
    </div>
  );
};

export default NovelCover;
