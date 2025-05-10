
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="bg-mihrab-cream py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="mihrab-heading text-3xl md:text-4xl mb-8 text-center">عن المؤلف</h1>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="مؤلف محراب التوبة"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:w-2/3">
                  <h2 className="text-2xl font-heading font-bold text-mihrab mb-4">محراب التوبة</h2>
                  <p className="text-muted-foreground text-sm mb-4">كاتب وفيلسوف</p>
                  
                  <div className="prose prose-lg text-mihrab-dark/80 max-w-none">
                    <p>
                      في عالم مليء بالضوضاء والسرعة، تأتي كتابات محراب التوبة لتقدم واحة من التأمل والتفكر العميق في قضايا الوجود والإنسانية.
                    </p>
                    
                    <p className="mt-4">
                      نشأ مؤلف محراب التوبة وسط بيئة ثقافية غنية، وتعمقت اهتماماته الفلسفية والروحانية منذ نعومة أظفاره. درس الفلسفة والأدب المقارن في الجامعة، وسافر إلى العديد من البلدان بحثاً عن المعرفة والحكمة من مصادرها المختلفة.
                    </p>
                    
                    <p className="mt-4">
                      يؤمن المؤلف بأن الأدب ليس مجرد وسيلة للترفيه، بل هو أداة قوية للتغيير والنمو الروحي والفكري. من خلال رواياته، يسعى إلى تقديم تجارب قرائية تلامس شغاف القلب وتثير التساؤلات العميقة حول معنى الحياة والوجود.
                    </p>
                    
                    <p className="mt-4">
                      تتميز أعماله بلغة أدبية رصينة وسرد مشوق يجمع بين العمق الفلسفي والجمال الأدبي، ما جعله يكتسب قاعدة قراء واسعة من المهتمين بالأدب الهادف والفكر العميق.
                    </p>
                    
                    <blockquote className="border-r-4 border-mihrab-gold pr-4 italic mt-6 mb-6">
                      "أؤمن أن الكلمة الصادقة يمكن أن تكون بلسماً للروح، وضوءاً للعقل، ودليلاً في دروب الحياة المظلمة."
                    </blockquote>
                    
                    <p className="mt-4">
                      يعمل المؤلف حالياً على توسيع عالم محراب التوبة من خلال سلسلة من الروايات المترابطة التي تستكشف مختلف جوانب التجربة الإنسانية والرحلة الروحية للفرد في عالمنا المعاصر.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-heading font-bold text-mihrab mb-6">مسيرة الكتابة</h2>
              
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-mihrab text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      2018
                    </div>
                    <h3 className="text-xl font-heading font-bold text-mihrab">البدايات الأولى</h3>
                  </div>
                  <p className="text-mihrab-dark/80">
                    بدأت رحلة الكتابة مع مجموعة من المقالات الفلسفية والتأملات التي نشرت في عدة مجلات أدبية وثقافية، لاقت استحساناً كبيراً من القراء والنقاد.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-mihrab text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      2020
                    </div>
                    <h3 className="text-xl font-heading font-bold text-mihrab">الرواية الأولى</h3>
                  </div>
                  <p className="text-mihrab-dark/80">
                    صدرت الرواية الأولى "في محراب التوبة" التي وضعت الأساس لعالم أدبي متكامل، واستطاعت أن تجذب اهتمام شريحة واسعة من القراء المهتمين بالأدب الروحاني والفلسفي.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-mihrab text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      2022
                    </div>
                    <h3 className="text-xl font-heading font-bold text-mihrab">توسع العالم الأدبي</h3>
                  </div>
                  <p className="text-mihrab-dark/80">
                    مع صدور روايتي "أسرار الصوفية" و "طريق المريدين"، بدأ عالم محراب التوبة بالتوسع ليشمل شخصيات وقصصاً مترابطة تشكل نسيجاً متكاملاً من التجارب الروحانية والفكرية.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-mihrab text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      2023
                    </div>
                    <h3 className="text-xl font-heading font-bold text-mihrab">إطلاق البوابة الإلكترونية</h3>
                  </div>
                  <p className="text-mihrab-dark/80">
                    مع تزايد الاهتمام بعالم محراب التوبة، تم إطلاق البوابة الإلكترونية كمنصة متكاملة لنشر الروايات وتوفير تجربة قراءة مميزة للقراء، مع ميزات تفاعلية تثري التجربة الأدبية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
