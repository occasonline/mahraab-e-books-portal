
import { Button } from "@/components/ui/button";
import NovelRating from "./NovelRating";
import { formatArabicDate } from '@/lib/dateUtils';

interface ReviewComment {
  id: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
}

interface NovelReviewsTabProps {
  comments: ReviewComment[];
}

const NovelReviewsTab = ({ comments }: NovelReviewsTabProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-heading font-bold text-mihrab mb-4 text-right">تقييمات القراء</h2>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-mihrab-beige pb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex">
                <NovelRating rating={comment.rating} />
              </div>
              <div>
                <p className="font-bold text-mihrab text-right">{comment.userName}</p>
                <p className="text-xs text-mihrab-dark/60 text-right">
                  {formatArabicDate(comment.date)}
                </p>
              </div>
            </div>
            <p className="text-mihrab-dark/80 text-right">{comment.content}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-mihrab-dark mb-4">قم بتسجيل الدخول لإضافة تقييمك</p>
        <Button className="bg-mihrab hover:bg-mihrab-dark">
          إضافة تقييم
        </Button>
      </div>
    </div>
  );
};

export default NovelReviewsTab;
