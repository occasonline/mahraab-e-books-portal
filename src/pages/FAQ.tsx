
import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  category: string;
  questions: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const faqData: FAQItem[] = [
  {
    category: "عن المشروع والمحتوى",
    questions: [
      {
        id: "what-is",
        question: "ما هو محراب التوبة؟",
        answer: "محراب التوبة هو مشروع أدبي روحاني يتضمن سلسلة من الروايات الفلسفية والروحانية، مصحوباً بمنصة إلكترونية متكاملة تتيح للقراء الوصول إلى المحتوى والتفاعل معه بطرق مبتكرة."
      },
      {
        id: "content-type",
        question: "ما نوع المحتوى المقدم في روايات محراب التوبة؟",
        answer: "تقدم روايات محراب التوبة محتوى أدبياً عميقاً يمزج بين السرد الروائي المشوق والتأملات الفلسفية والروحانية، مع التركيز على قضايا الوجود الإنساني والرحلة الروحية للفرد في العالم المعاصر."
      },
      {
        id: "author",
        question: "من هو مؤلف روايات محراب التوبة؟",
        answer: "مؤلف محراب التوبة هو كاتب وفيلسوف مهتم بالقضايا الروحانية والوجودية، يسعى من خلال كتاباته إلى تقديم تجارب أدبية ثرية تدعو للتفكر والتأمل في معنى الحياة والوجود."
      }
    ]
  },
  {
    category: "العضوية والاشتراكات",
    questions: [
      {
        id: "membership-types",
        question: "ما هي أنواع العضوية المتاحة في المنصة؟",
        answer: "تتوفر عدة مستويات للعضوية: العضوية المجانية التي تتيح الوصول إلى بعض المحتوى الأساسي، والعضوية المدفوعة التي توفر وصولاً كاملاً لجميع الروايات والميزات التفاعلية، وعضوية VIP التي تشمل مزايا إضافية مثل لقاءات خاصة مع المؤلف ونسخ ورقية من الإصدارات الجديدة."
      },
      {
        id: "subscription-cost",
        question: "كم تكلفة الاشتراك في المنصة؟",
        answer: "تبدأ أسعار الاشتراك من 10 دولارات شهرياً للعضوية الأساسية، و25 دولاراً شهرياً لعضوية VIP. كما تتوفر خيارات اشتراك سنوية بخصومات مميزة. العضوية المجانية متاحة دائماً مع وصول محدود للمحتوى."
      },
      {
        id: "payment-methods",
        question: "ما هي طرق الدفع المقبولة؟",
        answer: "نقبل الدفع عبر بطاقات الائتمان (فيزا، ماستركارد، أمريكان إكسبريس)، والمحافظ الإلكترونية مثل PayPal، بالإضافة إلى خيارات الدفع المحلية في بعض البلدان."
      },
      {
        id: "cancel-subscription",
        question: "كيف يمكنني إلغاء اشتراكي؟",
        answer: "يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة التحكم الخاصة بحسابك. بعد الإلغاء، ستستمر بالوصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية."
      }
    ]
  },
  {
    category: "استخدام المنصة",
    questions: [
      {
        id: "read-novels",
        question: "كيف يمكنني قراءة الروايات على المنصة؟",
        answer: "بعد تسجيل الدخول، يمكنك الوصول إلى مكتبة الروايات واختيار الرواية التي ترغب في قراءتها. ستفتح واجهة القراءة المتطورة التي تتيح لك ضبط إعدادات العرض وحفظ إشارات مرجعية وتدوين ملاحظات أثناء القراءة."
      },
      {
        id: "download-formats",
        question: "هل يمكنني تحميل الروايات بتنسيقات مختلفة؟",
        answer: "نعم، يمكن للأعضاء المشتركين تحميل الروايات بتنسيقات مختلفة مثل PDF وEPUB، مما يتيح لهم القراءة على مختلف الأجهزة حتى بدون اتصال بالإنترنت. بعض الروايات قد تكون متاحة للتحميل فقط لأعضاء VIP."
      },
      {
        id: "mobile-reading",
        question: "هل يمكنني قراءة الروايات على هاتفي المحمول؟",
        answer: "نعم، المنصة مصممة بشكل متجاوب تماماً مع جميع أحجام الشاشات، مما يتيح تجربة قراءة مريحة على الهواتف الذكية والأجهزة اللوحية. كما نعمل على تطوير تطبيقات خاصة لنظامي iOS وAndroid."
      }
    ]
  },
  {
    category: "الدعم والمساعدة",
    questions: [
      {
        id: "contact-support",
        question: "كيف يمكنني التواصل مع الدعم الفني؟",
        answer: "يمكنك التواصل مع فريق الدعم الفني من خلال نموذج الاتصال في صفحة 'اتصل بنا'، أو عبر البريد الإلكتروني support@mihrab-altawba.com، أو من خلال الدردشة المباشرة المتاحة في المنصة خلال ساعات العمل."
      },
      {
        id: "response-time",
        question: "ما هو متوسط وقت الرد على استفسارات الدعم؟",
        answer: "نسعى للرد على جميع استفسارات الدعم خلال 24 ساعة عمل. للحالات العاجلة، يمكنك استخدام خدمة الدردشة المباشرة للحصول على مساعدة فورية خلال ساعات العمل (9 صباحاً - 9 مساءً بتوقيت غرينتش)."
      }
    ]
  }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>(faqData[0].category);
  
  const filteredQuestions = faqData.find(item => item.category === activeCategory)?.questions || [];
  
  return (
    <Layout>
      <div className="bg-mihrab-cream py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="mihrab-heading text-3xl md:text-4xl mb-8 text-center">الأسئلة الشائعة</h1>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Categories sidebar */}
                <div className="md:w-1/3 bg-mihrab-beige p-6">
                  <h2 className="font-heading font-bold text-lg text-mihrab mb-4 border-b border-mihrab-light pb-2">
                    الأقسام
                  </h2>
                  <nav className="space-y-2">
                    {faqData.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setActiveCategory(category.category)}
                        className={`w-full text-right py-2 px-4 rounded transition-colors ${
                          activeCategory === category.category
                            ? "bg-mihrab text-white"
                            : "hover:bg-mihrab-cream text-mihrab-dark"
                        }`}
                      >
                        {category.category}
                      </button>
                    ))}
                  </nav>
                </div>
                
                {/* FAQ Content */}
                <div className="md:w-2/3 p-6">
                  <h2 className="font-heading font-bold text-xl text-mihrab mb-6">
                    {activeCategory}
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {filteredQuestions.map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border-b border-mihrab-beige">
                        <AccordionTrigger className="font-medium text-mihrab hover:text-mihrab-gold hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-heading font-bold text-mihrab mb-4">
                لم تجد إجابة لسؤالك؟
              </h2>
              <p className="text-muted-foreground mb-6">
                لا تتردد في التواصل معنا مباشرة وسنرد على استفسارك في أقرب وقت ممكن
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-mihrab text-white px-6 py-3 rounded-md font-medium hover:bg-mihrab-dark transition-colors"
              >
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
