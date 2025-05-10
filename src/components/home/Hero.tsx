
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-mihrab-beige py-16 md:py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-mihrab-gold opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-mihrab opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-right space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-mihrab">
              بوابة روايات محراب التوبة
            </h1>
            <p className="text-mihrab-dark/80 text-lg md:text-xl leading-relaxed">
              رحلة روحانية فلسفية في أعماق النفس البشرية، حيث الأدب يلتقي بالتأمل والحكمة في بوابة أدبية فريدة من نوعها.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/novels">
                <Button className="bg-mihrab text-white hover:bg-mihrab-dark min-w-36">
                  استكشف الروايات
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-mihrab text-mihrab hover:bg-mihrab/5 min-w-36">
                  تعرف علينا
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-mihrab to-mihrab-dark rounded-lg transform rotate-3 shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-mihrab-light to-mihrab rounded-lg transform -rotate-3 shadow-lg"></div>
              <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-mihrab/90 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h3 className="font-heading text-2xl font-bold mb-2">رواية "في محراب التوبة"</h3>
                    <p className="text-mihrab-cream">الرحلة الأولى في عالم الروحانيات والتأملات الفلسفية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
