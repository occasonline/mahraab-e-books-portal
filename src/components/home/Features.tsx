
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: (
      <svg className="w-10 h-10 text-mihrab-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
    ),
    title: "روايات فلسفية عميقة",
    description: "محتوى أدبي يمزج بين الإبداع الروائي والعمق الفلسفي، يدعو للتفكر والتأمل في قضايا الوجود والإنسانية."
  },
  {
    icon: (
      <svg className="w-10 h-10 text-mihrab-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    ),
    title: "تجربة قراءة متطورة",
    description: "منصة قراءة إلكترونية مريحة للعين، مع خيارات مخصصة للخط والألوان ووضع القراءة الليلي وإشارات مرجعية."
  },
  {
    icon: (
      <svg className="w-10 h-10 text-mihrab-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
    ),
    title: "مجتمع للقراء والمفكرين",
    description: "منصة تفاعلية للتواصل ومناقشة الأفكار والتأملات حول المحتوى الروائي مع مجتمع من محبي الأدب الهادف."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mihrab-heading text-3xl mb-6">لماذا محراب التوبة؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            منصة أدبية متكاملة تقدم تجربة قراءة فريدة من نوعها، مصممة لعشاق الأدب الفلسفي والروحاني
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-mihrab-cream rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-mihrab mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
