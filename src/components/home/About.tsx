
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-16 bg-mihrab-cream">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-full h-full border-2 border-mihrab-gold rounded-lg"></div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="مؤلف محراب التوبة" 
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-mihrab">عن محراب التوبة</h2>
            
            <div className="space-y-4 text-mihrab-dark/80 leading-relaxed">
              <p>
                محراب التوبة هو مشروع أدبي روحاني يهدف إلى استكشاف أعماق النفس البشرية من خلال سلسلة من الروايات الفلسفية والتأملية التي تجمع بين الأدب الراقي والفكر العميق.
              </p>
              <p>
                تأسس المشروع على يد كاتب مهتم بالروحانيات والفلسفة، سعياً لتقديم محتوى أدبي هادف يمس شغاف القلوب ويدعو إلى التأمل والتفكر في مسائل الوجود والإنسانية.
              </p>
              <p>
                تتميز روايات محراب التوبة بلغتها الأدبية الرصينة وعمقها الفكري، مع سرد مشوق يجمع بين المتعة الأدبية والفائدة الروحية، مما يجعلها تجربة قرائية فريدة من نوعها.
              </p>
            </div>
            
            <div className="pt-4">
              <Link to="/about">
                <Button className="bg-mihrab hover:bg-mihrab-dark">
                  اقرأ المزيد عن المؤلف
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
