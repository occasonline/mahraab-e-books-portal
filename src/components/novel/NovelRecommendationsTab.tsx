
import { Button } from "@/components/ui/button";
import NovelRating from "./NovelRating";

const NovelRecommendationsTab = () => {
  // Format the rating as stars
  const renderStars = (rating: number) => {
    return <NovelRating rating={rating} />;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-heading font-bold text-mihrab mb-6 text-right">روايات قد تعجبك</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="novel-card">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="أسرار الصوفية"
              className="novel-cover"
              onError={(e) => {
                // If image fails to load, set to placeholder
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-heading text-lg font-bold text-mihrab mb-1 text-right">أسرار الصوفية</h3>
            <p className="text-sm text-mihrab-dark/70 mb-2 text-right">تأليف: محراب التوبة</p>
            <div className="flex justify-between items-center">
              <Button size="sm" variant="outline" className="text-xs">
                معرفة المزيد
              </Button>
              <div className="flex">
                {renderStars(4.5)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="novel-card">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="طريق المريدين"
              className="novel-cover"
              onError={(e) => {
                // If image fails to load, set to placeholder
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-heading text-lg font-bold text-mihrab mb-1 text-right">طريق المريدين</h3>
            <p className="text-sm text-mihrab-dark/70 mb-2 text-right">تأليف: محراب التوبة</p>
            <div className="flex justify-between items-center">
              <Button size="sm" variant="outline" className="text-xs">
                معرفة المزيد
              </Button>
              <div className="flex">
                {renderStars(4.7)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="novel-card">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="سراج المعرفة"
              className="novel-cover"
              onError={(e) => {
                // If image fails to load, set to placeholder
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-heading text-lg font-bold text-mihrab mb-1 text-right">سراج المعرفة</h3>
            <p className="text-sm text-mihrab-dark/70 mb-2 text-right">تأليف: محراب التوبة</p>
            <div className="flex justify-between items-center">
              <Button size="sm" variant="outline" className="text-xs">
                معرفة المزيد
              </Button>
              <div className="flex">
                {renderStars(4.6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelRecommendationsTab;
