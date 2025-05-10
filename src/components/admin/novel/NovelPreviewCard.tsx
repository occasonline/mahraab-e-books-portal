
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NovelFormValues } from "@/schemas/novelSchema";
import { Book, Eye } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NovelPreviewCardProps {
  novel: Partial<NovelFormValues>;
}

const NovelPreviewCard = ({ novel }: NovelPreviewCardProps) => {
  // Create a preview URL for uploaded files with better fallback handling
  const getCoverImageUrl = () => {
    if (novel.coverImage) {
      return URL.createObjectURL(novel.coverImage);
    }
    
    // Check if imageUrl exists and is not empty
    if (novel.imageUrl && novel.imageUrl.trim() !== "") {
      return novel.imageUrl;
    }
    
    // Return a default placeholder image as the final fallback
    return "/placeholder.svg";
  };

  const coverImageUrl = getCoverImageUrl();

  // Format the tags as badges
  const renderTags = () => {
    if (!novel.tags || novel.tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {novel.tags.map((tag, index) => (
          <span key={index} className="bg-mihrab-beige text-mihrab-dark text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <AspectRatio ratio={4/3}>
          <img
            src={coverImageUrl}
            alt={novel.title || "غلاف الرواية"}
            className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
            onError={(e) => {
              // If image fails to load, set to placeholder
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-heading text-mihrab text-lg">{novel.title || "عنوان الرواية"}</CardTitle>
          {novel.isPremium && (
            <span className="bg-mihrab-gold text-white text-xs font-bold px-2 py-1 rounded-full">
              حصري
            </span>
          )}
        </div>
        <CardDescription>تأليف: {novel.author || "المؤلف"}</CardDescription>
        {renderTags()}
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-mihrab-dark/80 text-sm line-clamp-3">
          {novel.description || "وصف الرواية سيظهر هنا..."}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-1 border-t border-mihrab-beige/30">
        <div className="flex items-center text-sm text-mihrab-dark/70">
          <Eye size={16} className="ml-1" />
          <span>معاينة</span>
        </div>
        <Button size="sm" className="bg-mihrab hover:bg-mihrab-dark text-xs">
          <Book size={14} className="ml-1" />
          قراءة الرواية
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NovelPreviewCard;
