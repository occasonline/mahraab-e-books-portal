
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Novel {
  id: string;
  title: string;
  image: string;
  author: string;
  description: string;
}

const FEATURED_NOVELS: Novel[] = [
  {
    id: "1",
    title: "في محراب التوبة",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "رحلة روحانية في أعماق النفس البشرية، تكشف أسرار التوبة والعودة إلى الذات الحقيقية."
  },
  {
    id: "2",
    title: "أسرار الصوفية",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "سلسلة من القصص المترابطة تستكشف عمق الفلسفة الصوفية وتأثيرها على الروح الإنسانية."
  },
  {
    id: "3",
    title: "طريق المريدين",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "محراب التوبة",
    description: "حكاية مشوقة عن مجموعة من المريدين في رحلة بحث عن الحقيقة والمعرفة الروحانية."
  }
];

const FeaturedNovels = () => {
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
          {FEATURED_NOVELS.map((novel) => (
            <Card key={novel.id} className="novel-card border-mihrab-beige">
              <div className="relative h-64 overflow-hidden">
                <img src={novel.image} alt={novel.title} className="novel-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-mihrab/90 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm">{novel.description}</p>
                </div>
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
