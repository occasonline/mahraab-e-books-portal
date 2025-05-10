
import { NovelFormValues } from "@/schemas/novelSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NovelPreviewCard from "./NovelPreviewCard";

interface NovelPreviewProps {
  data: Partial<NovelFormValues>;
}

const NovelPreview = ({ data }: NovelPreviewProps) => {
  // Create a preview URL for uploaded files
  const coverImageUrl = data.coverImage
    ? URL.createObjectURL(data.coverImage)
    : data.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Format rating as stars
  const renderStars = (rating: number = 4.5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-mihrab-gold' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Format the tags as badges
  const renderTags = () => {
    if (!data.tags || data.tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {data.tags.map((tag, index) => (
          <span key={index} className="bg-mihrab-beige text-mihrab-dark text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-mihrab-cream/40 rounded-lg p-6">
      <h3 className="font-heading text-xl font-bold text-mihrab mb-4">معاينة كيف سيظهر للقراء</h3>
      
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="card">معاينة البطاقة</TabsTrigger>
          <TabsTrigger value="detail">معاينة الصفحة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="p-4 bg-white rounded-md shadow">
          <div className="max-w-xs mx-auto">
            <NovelPreviewCard novel={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="detail">
          <div className="bg-white rounded-md shadow p-4">
            <div className="md:flex">
              <div className="md:w-1/3 p-4">
                <div className="relative aspect-[3/4] max-w-xs mx-auto">
                  <img 
                    src={coverImageUrl} 
                    alt={data.title || "غلاف الرواية"}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  {data.isPremium && (
                    <div className="absolute top-3 right-3 bg-mihrab-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                      حصري
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 p-4">
                <h1 className="text-2xl font-heading font-bold text-mihrab mb-2">
                  {data.title || "عنوان الرواية"}
                </h1>
                <p className="text-mihrab-dark/70 mb-3">تأليف: {data.author || "المؤلف"}</p>
                
                <div className="flex items-center mb-4">
                  {renderStars()}
                  <span className="mr-2 text-mihrab-dark/70">4.5/5 (3 تقييمات)</span>
                </div>
                
                {renderTags()}
                
                <p className="text-mihrab-dark/90 leading-relaxed mb-6">
                  {data.description || "وصف الرواية سيظهر هنا..."}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">تاريخ النشر</p>
                    <p className="font-bold text-mihrab-dark">
                      {new Date().toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">الحالة</p>
                    <p className="font-bold text-mihrab-dark">
                      {data.status === "published" ? "منشورة" : "مسودة"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-mihrab mb-2">نموذج القراءة</h3>
                  <div className="p-3 bg-mihrab-cream/50 rounded-md text-sm">
                    {data.sample ? (
                      <p className="line-clamp-4">{data.sample}</p>
                    ) : (
                      <p className="italic text-mihrab-dark/50">لم تتم إضافة نموذج القراءة بعد...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovelPreview;
