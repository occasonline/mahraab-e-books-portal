
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-mihrab to-mihrab-dark text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            انضم إلى عالم محراب التوبة اليوم
          </h2>
          <p className="text-lg text-mihrab-cream opacity-90">
            سجل الآن واستمتع بتجربة قراءة فريدة من نوعها، مع وصول حصري لأحدث روايات محراب التوبة وميزات خاصة للأعضاء.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-mihrab hover:bg-mihrab-cream hover:text-mihrab-dark min-w-40 text-lg">
                سجل مجاناً
              </Button>
            </Link>
            <Link to="/novels">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 min-w-40 text-lg">
                استكشف الروايات
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-mihrab-cream opacity-70">
            تمتع بفترة تجريبية مجانية لمدة 7 أيام مع إمكانية الوصول إلى جميع الميزات المتاحة للأعضاء.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
