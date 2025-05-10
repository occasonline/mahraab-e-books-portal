
import { useState } from "react";
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

interface Novel {
  id: string;
  title: string;
  image: string;
  author: string;
  description: string;
  category: string;
  date: string;
  isPremium: boolean;
}

const NOVELS: Novel[] = [
  {
    id: "1",
    title: "في محراب التوبة",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "رحلة روحانية في أعماق النفس البشرية، تكشف أسرار التوبة والعودة إلى الذات الحقيقية.",
    category: "فلسفي",
    date: "2023-06-15",
    isPremium: false
  },
  {
    id: "2",
    title: "أسرار الصوفية",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "سلسلة من القصص المترابطة تستكشف عمق الفلسفة الصوفية وتأثيرها على الروح الإنسانية.",
    category: "صوفي",
    date: "2023-08-20",
    isPremium: true
  },
  {
    id: "3",
    title: "طريق المريدين",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "حكاية مشوقة عن مجموعة من المريدين في رحلة بحث عن الحقيقة والمعرفة الروحانية.",
    category: "روحاني",
    date: "2023-11-05",
    isPremium: false
  },
  {
    id: "4",
    title: "مرايا النفس",
    image: "https://images.unsplash.com/photo-1531167599833-609a4c83bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "استبطان عميق للنفس البشرية من خلال قصص متشابكة تعكس صراعات الإنسان الداخلية.",
    category: "نفسي",
    date: "2024-01-12",
    isPremium: true
  },
  {
    id: "5",
    title: "سراج المعرفة",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "رواية تتناول رحلة البحث عن المعرفة الحقيقية وسط ظلمات الجهل والأوهام.",
    category: "فلسفي",
    date: "2024-03-20",
    isPremium: false
  },
  {
    id: "6",
    title: "تجليات العارفين",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "قصص ملهمة من حياة العارفين والمتصوفة عبر التاريخ وتأثيرهم على الفكر الإنساني.",
    category: "صوفي",
    date: "2024-04-30",
    isPremium: true
  }
];

const Novels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  
  const filteredNovels = NOVELS.filter(novel => {
    // Filter by search query
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          novel.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || novel.category === categoryFilter;
    
    // Filter by availability
    const matchesAvailability = availabilityFilter === "all" || 
                               (availabilityFilter === "free" && !novel.isPremium) ||
                               (availabilityFilter === "premium" && novel.isPremium);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });
  
  const categories = Array.from(new Set(NOVELS.map(novel => novel.category)));
  
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
                    <img src={novel.image} alt={novel.title} className="novel-cover" />
                    {novel.isPremium && (
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
                        {new Date(novel.date).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                        })}
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
