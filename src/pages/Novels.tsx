import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNovels } from "@/services/novelService";
import { Novel } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { formatArabicDate } from "@/lib/dateUtils";

const Novels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await getNovels();
        // فقط الروايات المنشورة وليست مسودات
        const publishedNovels = data.filter(novel => novel.status === 'published');
        setNovels(publishedNovels);
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

  // استخراج جميع التصنيفات المتوفرة من الروايات
  const categories = Array.from(new Set(novels.map(novel => novel.category)));

  const filteredNovels = novels.filter(novel => {
    // تصفية حسب البحث
    const matchesSearch = 
      novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // تصفية حسب التصنيف
    const matchesCategory = categoryFilter === "all" || novel.category === categoryFilter;
    
    // تصفية حسب الإتاحة
    const matchesAvailability = availabilityFilter === "all" || 
                              (availabilityFilter === "free" && !novel.is_premium) ||
                              (availabilityFilter === "premium" && novel.is_premium);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  if (loading) {
    return (
      <Layout>
        <section className="bg-mihrab bg-opacity-5 py-12">
          <div className="container mx-auto px-4 text-center">
            <p>جاري تحميل الروايات...</p>
          </div>
        </section>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <section className="bg-mihrab bg-opacity-5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mihrab-heading text-3xl md:text-4xl mb-8 text-center">روايات محراب التوبة</h1>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-mihrab mb-2">بحث</label>
                <Input
                  type="text"
                  placeholder="ابحث عن رواية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-mihrab-beige focus:border-mihrab focus:ring-mihrab"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mihrab mb-2">التصنيف</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-mihrab-beige focus:border-mihrab focus:ring-mihrab">
                    <SelectValue placeholder="جميع التصنيفات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mihrab mb-2">الإتاحة</label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="border-mihrab-beige focus:border-mihrab focus:ring-mihrab">
                    <SelectValue placeholder="جميع الروايات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الروايات</SelectItem>
                    <SelectItem value="free">روايات مجانية</SelectItem>
                    <SelectItem value="premium">روايات حصرية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Novels Grid */}
          {filteredNovels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNovels.map((novel) => (
                <Card key={novel.id} className="novel-card">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={novel.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={novel.title} 
                      className="novel-cover" 
                    />
                    {novel.is_premium && (
                      <div className="absolute top-4 right-4 bg-mihrab-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                        حصري
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-mihrab/90 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm">{novel.description}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading text-xl font-bold text-mihrab">{novel.title}</h3>
                      <span className="bg-mihrab bg-opacity-10 text-mihrab-dark text-xs px-2 py-1 rounded">
                        {novel.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">تأليف: {novel.author}</p>
                    <div className="flex items-center justify-between">
                      <Link to={`/novel/${novel.id}`}>
                        <Button variant="outline" className="text-mihrab border-mihrab hover:bg-mihrab-cream">
                          معرفة المزيد
                        </Button>
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {formatArabicDate(novel.created_at || new Date())}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-heading font-medium text-mihrab mb-2">لم يتم العثور على روايات</h3>
              <p className="text-muted-foreground">حاول تغيير معايير البحث الخاصة بك</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Novels;
