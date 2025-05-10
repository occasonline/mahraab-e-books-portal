
import { useState } from "react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "روايات محراب التوبة فتحت لي آفاقاً جديدة في التفكير والتأمل. أسلوب الكتابة وعمق الأفكار لا مثيل لهما.",
    name: "أحمد محمود",
    title: "باحث في الفلسفة",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    quote: "هذه الروايات ليست مجرد قصص، بل رحلات روحانية حقيقية تلامس شغاف القلب وتحرك العقل بطريقة فريدة.",
    name: "سارة الراشد",
    title: "كاتبة وناقدة أدبية",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    quote: "منصة محراب التوبة تقدم تجربة قراءة استثنائية، ليس فقط من ناحية المحتوى ولكن أيضاً التصميم وسهولة الاستخدام.",
    name: "خالد العنزي",
    title: "مطور ومصمم تجربة مستخدم",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const currentTestimonial = testimonials[activeIndex];
  
  return (
    <section className="py-16 bg-mihrab bg-opacity-5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mihrab-heading text-3xl mb-6">آراء القراء</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 relative">
            <div className="absolute top-6 right-8 opacity-30">
              <svg className="w-16 h-16 text-mihrab-gold" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"></path>
              </svg>
            </div>
            
            <div className="relative z-10">
              <blockquote className="text-xl md:text-2xl font-heading font-medium text-mihrab-dark mb-8">
                "{currentTestimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-mihrab">{currentTestimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{currentTestimonial.title}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-mihrab-beige flex items-center justify-center text-mihrab hover:bg-mihrab-cream transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-mihrab-beige flex items-center justify-center text-mihrab hover:bg-mihrab-cream transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full mx-1 ${
                      index === activeIndex ? "bg-mihrab-gold" : "bg-mihrab-beige"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
