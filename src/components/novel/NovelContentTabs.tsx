
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NovelDescriptionTab from "./NovelDescriptionTab";
import NovelSampleTab from "./NovelSampleTab";
import NovelReviewsTab from "./NovelReviewsTab";
import NovelRecommendationsTab from "./NovelRecommendationsTab";
import { Novel } from "@/types/supabase";

interface ReviewComment {
  id: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
}

interface NovelContentTabsProps {
  novel: Novel;
  comments: ReviewComment[];
  onStartReading: () => void;
}

const NovelContentTabs = ({ novel, comments, onStartReading }: NovelContentTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-4 bg-mihrab-beige">
          <TabsTrigger value="description">التفاصيل</TabsTrigger>
          <TabsTrigger value="sample">نموذج القراءة</TabsTrigger>
          <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          <TabsTrigger value="recommendations">روايات مشابهة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <NovelDescriptionTab fullDescription={novel.full_description} />
        </TabsContent>
        
        <TabsContent value="sample">
          <NovelSampleTab 
            title={novel.title} 
            sample={novel.sample} 
            onStartReading={onStartReading} 
          />
        </TabsContent>
        
        <TabsContent value="reviews">
          <NovelReviewsTab comments={comments} />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <NovelRecommendationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovelContentTabs;
