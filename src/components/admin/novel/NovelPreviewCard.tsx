
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NovelFormValues } from "@/schemas/novelSchema";
import { Book, Eye } from "lucide-react";

interface NovelPreviewCardProps {
  novel: Partial<NovelFormValues>;
}

const NovelPreviewCard = ({ novel }: NovelPreviewCardProps) => {
  // Create a preview URL for uploaded files
  const coverImageUrl = novel.coverImage
    ? URL.createObjectURL(novel.coverImage)
    : novel.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

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
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={coverImageUrl}
          alt={novel.title || "غلاف الرواية"}
          className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
        />
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
