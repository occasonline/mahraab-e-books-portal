
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNovels } from "@/services/novelService";
import { Novel } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";

const FeaturedNovels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await getNovels();
        // فقط الروايات المنشورة وليست مسودات
        const publishedNovels = data.filter(novel => novel.status === 'published');
        // اختيار 3 روايات كحد أقصى
        setNovels(publishedNovels.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("خطأ في تحميل الروايات:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الروايات",
          description: "حدث خطأ أثناء محاولة تحميل الروايات. يرجى المحاولة مرة أخرى لاحقاً.",
        });
        setLoading(false);
      }
    };

    fetchNovels();
  }, [toast]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>جاري تحميل الروايات...</p>
        </div>
      </section>
    );
  }

  // إذا لم يكن هناك روايات منشورة
  if (novels.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mihrab-heading text-3xl mb-6">روايات مختارة</h2>
          <p className="text-muted-foreground">
            لا توجد روايات منشورة حالياً. يمكنك إضافة روايات جديدة من لوحة التحكم.
          </p>
          <div className="mt-6">
            <Link to="/novels">
              <Button className="bg-mihrab hover:bg-mihrab-dark">
                جميع الروايات
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mihrab-heading text-3xl mb-6">روايات مختارة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة منتقاة من أفضل روايات عالم محراب التوبة، رحلات أدبية متميزة تجمع بين الروحانية والفلسفة والتشويق
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels.map((novel) => (
            <Card key={novel.id} className="novel-card border-mihrab-beige">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={novel.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={novel.title} 
                  className="novel-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mihrab/90 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm">{novel.description}</p>
                </div>
                {novel.is_premium && (
                  <div className="absolute top-2 right-2 bg-mihrab-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                    حصري
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-heading text-xl font-bold text-mihrab mb-2">{novel.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">تأليف: {novel.author}</p>
                <div className="flex items-center justify-between">
                  <Link to={`/novel/${novel.id}`}>
                    <Button variant="outline" className="text-mihrab border-mihrab hover:bg-mihrab-cream">
                      معرفة المزيد
                    </Button>
                  </Link>
                  <span className="text-sm text-mihrab-light flex items-center gap-1">
                    <svg className="w-5 h-5 text-mihrab-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    4.8/5
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/novels">
            <Button className="bg-mihrab hover:bg-mihrab-dark">
              جميع الروايات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNovels;
