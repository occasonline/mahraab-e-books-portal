
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Novel {
  id: string;
  title: string;
  image: string;
  author: string;
  description: string;
  fullDescription: string;
  publishDate: string;
  rating: number;
  pageCount: number;
  category: string;
  tags: string[];
  isPremium: boolean;
  sample: string;
}

// Mock data for a specific novel
const novelData: Novel = {
  id: "1",
  title: "في محراب التوبة",
  image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  author: "محراب التوبة",
  description: "رحلة روحانية في أعماق النفس البشرية، تكشف أسرار التوبة والعودة إلى الذات الحقيقية.",
  fullDescription: "«في محراب التوبة» رواية فلسفية روحانية تأخذ القارئ في رحلة عميقة داخل أغوار النفس البشرية، متتبعة مسار شخصية رئيسية تمر بتحولات جذرية في رؤيتها للعالم والوجود. بعد سنوات من الانغماس في عالم المادة والسعي وراء الملذات، يجد البطل نفسه في مفترق طرق وجودي حين تهتز كل قناعاته إثر حادثة مفاجئة تقلب حياته رأساً على عقب.\n\nتبدأ الرواية بلحظة سقوط واكتشاف الفراغ الروحي، ثم تنطلق في مسار تصاعدي عبر طريق التوبة والعودة إلى الفطرة النقية. خلال هذه الرحلة، يلتقي البطل بشخصيات متنوعة تمثل محطات هامة في طريق التحول، بدءاً من الشيخ الحكيم الذي يصبح مرشده الروحي، مروراً بأشخاص يمثلون تحديات وعقبات تختبر صدق توبته وعزيمته.\n\nتتناول الرواية بعمق فلسفي قضايا الوجود الإنساني والصراع بين النفس الأمارة بالسوء والنفس المطمئنة، متسائلة عن معنى الحياة الحقيقي ومفهوم السعادة الأصيل. وعبر فصولها المتتالية، تقدم رؤية متكاملة لمفهوم التوبة لا كمجرد ندم على الماضي، بل كتحول جذري في الوعي والإدراك يفتح آفاقاً جديدة للروح المتعطشة للمعرفة والسلام الداخلي.",
  publishDate: "2023-06-15",
  rating: 4.8,
  pageCount: 342,
  category: "فلسفي",
  tags: ["روحانية", "فلسفة", "تطوير ذاتي", "عرفان"],
  isPremium: false,
  sample: "استيقظ «سالم» على صوت المنبه المزعج كعادته كل صباح. لكن هذا الصباح كان مختلفاً. شعر بثقل غريب في صدره، وكأن هناك جبلاً جاثماً عليه. نظر إلى السقف للحظات طويلة متسائلاً: «هل هذا كل شيء؟ هل هذا ما خلقت لأجله؟»\n\nثلاثة عقود من العمر مرت كومضة برق... دوامة لا تنتهي من الركض وراء مكاسب مادية وملذات عابرة، ثم إذ بالسؤال الوجودي يقف شامخاً أمام عينيه كجبل لا يمكن تجاوزه.\n\nارتدى ملابسه ببطء غير معتاد، وخرج إلى عمله في الشركة الاستثمارية التي قضى فيها عشر سنوات من حياته. لكنه في ذلك اليوم كان كمن يرى العالم لأول مرة. الوجوه الشاحبة في مترو الأنفاق، العيون الزجاجية المنهكة التي تحدق في شاشات الهواتف، الضجيج الذي لا ينقطع... كل شيء بدا غريباً وخالياً من المعنى.\n\n«ماذا لو توقفت عن الركض؟» سأل نفسه وهو يدخل مبنى الشركة الزجاجي الشاهق."
};

// Mock comments
const comments = [
  {
    id: '1',
    userName: 'أحمد محمد',
    date: '2023-11-10',
    rating: 5,
    content: 'رواية مؤثرة جداً وعميقة. استطاع الكاتب أن ينقل التجربة الروحانية بأسلوب أدبي رائع. أنصح بشدة بقراءتها.'
  },
  {
    id: '2',
    userName: 'سارة خالد',
    date: '2023-10-25',
    rating: 4,
    content: 'التجربة الفلسفية في الرواية فريدة من نوعها، وإن كنت أرى أن بعض الفصول كانت طويلة بعض الشيء. مع ذلك، استمتعت كثيراً بالقراءة.'
  },
  {
    id: '3',
    userName: 'محمد العنزي',
    date: '2023-09-15',
    rating: 5,
    content: 'من أفضل ما قرأت في الأدب الروحاني. عالم فريد من الأفكار والتأملات التي تلامس شغاف القلب.'
  }
];

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Assuming you would fetch the specific novel based on the id
  // For now we'll just use the mock data
  const novel = novelData;
  
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 16,
    lineHeight: 1.6,
    theme: 'light',
  });
  
  const handleStartReading = () => {
    if (novel.isPremium) {
      toast({
        title: "هذه الرواية حصرية",
        description: "يرجى الترقية إلى العضوية المدفوعة للوصول إلى هذه الرواية.",
      });
    } else {
      toast({
        title: "تم فتح الرواية",
        description: "استمتع بقراءة رواية في محراب التوبة!",
      });
    }
  };
  
  const handleDownload = (format: string) => {
    toast({
      title: `جاري تحميل الرواية`,
      description: `تم بدء تحميل الرواية بتنسيق ${format}`,
    });
  };
  
  // Format the rating as stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-mihrab-gold' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <Layout>
      <div className="bg-mihrab-cream py-12">
        <div className="container mx-auto px-4">
          {/* Novel Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 p-6">
                <div className="relative aspect-[3/4] max-w-xs mx-auto">
                  <img 
                    src={novel.image} 
                    alt={novel.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  {novel.isPremium && (
                    <div className="absolute top-4 right-4 bg-mihrab-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                      حصري
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-mihrab mb-2">
                  {novel.title}
                </h1>
                <p className="text-mihrab-dark/70 mb-4">تأليف: {novel.author}</p>
                
                <div className="flex items-center mb-4">
                  {renderStars(novel.rating)}
                  <span className="ml-2 text-mihrab-dark/70">{novel.rating}/5 ({comments.length} تقييمات)</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-mihrab bg-opacity-10 text-mihrab-dark text-xs px-3 py-1 rounded-full">
                    {novel.category}
                  </span>
                  {novel.tags.map((tag, index) => (
                    <span key={index} className="bg-mihrab-beige text-mihrab-dark text-xs px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-mihrab-dark/90 leading-relaxed mb-6">
                  {novel.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">تاريخ النشر</p>
                    <p className="font-bold text-mihrab-dark">
                      {new Date(novel.publishDate).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">عدد الصفحات</p>
                    <p className="font-bold text-mihrab-dark">{novel.pageCount}</p>
                  </div>
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">التصنيف</p>
                    <p className="font-bold text-mihrab-dark">{novel.category}</p>
                  </div>
                  <div className="bg-mihrab-beige bg-opacity-30 p-3 rounded text-center">
                    <p className="text-xs text-mihrab-dark/70">التقييم</p>
                    <p className="font-bold text-mihrab-dark">{novel.rating}/5</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={handleStartReading}
                    className="bg-mihrab hover:bg-mihrab-dark min-w-40"
                  >
                    ابدأ القراءة
                  </Button>
                  
                  <div className="relative group">
                    <Button variant="outline" className="border-mihrab text-mihrab hover:bg-mihrab-cream min-w-40">
                      تحميل
                    </Button>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                      <button 
                        onClick={() => handleDownload('PDF')}
                        className="w-full text-right px-4 py-2 hover:bg-mihrab-cream text-sm text-mihrab-dark"
                      >
                        PDF تحميل
                      </button>
                      <button 
                        onClick={() => handleDownload('EPUB')}
                        className="w-full text-right px-4 py-2 hover:bg-mihrab-cream text-sm text-mihrab-dark"
                      >
                        EPUB تحميل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Novel Content Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-4 bg-mihrab-beige">
                <TabsTrigger value="description">التفاصيل</TabsTrigger>
                <TabsTrigger value="sample">نموذج القراءة</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                <TabsTrigger value="recommendations">روايات مشابهة</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <h2 className="text-xl font-heading font-bold text-mihrab mb-4">عن الرواية</h2>
                <div className="prose prose-lg max-w-none text-mihrab-dark/80 leading-relaxed whitespace-pre-line">
                  {novel.fullDescription}
                </div>
              </TabsContent>
              
              <TabsContent value="sample" className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-heading font-bold text-mihrab">نموذج القراءة</h2>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <button 
                      onClick={() => setReaderSettings({...readerSettings, fontSize: readerSettings.fontSize - 1})}
                      className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
                      disabled={readerSettings.fontSize <= 12}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span className="text-sm text-mihrab-dark">
                      حجم الخط: {readerSettings.fontSize}
                    </span>
                    <button 
                      onClick={() => setReaderSettings({...readerSettings, fontSize: readerSettings.fontSize + 1})}
                      className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
                      disabled={readerSettings.fontSize >= 24}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setReaderSettings({
                        ...readerSettings, 
                        theme: readerSettings.theme === 'light' ? 'dark' : 'light'
                      })}
                      className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
                    >
                      {readerSettings.theme === 'light' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div 
                  className={`p-6 rounded-lg ${
                    readerSettings.theme === 'light' 
                      ? 'bg-mihrab-cream text-mihrab-dark' 
                      : 'bg-mihrab-dark text-mihrab-cream'
                  }`}
                  style={{
                    fontSize: `${readerSettings.fontSize}px`,
                    lineHeight: readerSettings.lineHeight,
                  }}
                >
                  <p className="mb-4 font-heading font-bold text-center text-2xl">في محراب التوبة</p>
                  <p className="mb-8 text-center">الفصل الأول</p>
                  <div className="whitespace-pre-line leading-relaxed">
                    {novel.sample}
                  </div>
                  <div className="text-center mt-8">
                    <Button 
                      onClick={handleStartReading}
                      className="bg-mihrab hover:bg-mihrab-dark"
                    >
                      متابعة القراءة
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <h2 className="text-xl font-heading font-bold text-mihrab mb-4">تقييمات القراء</h2>
                
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-mihrab-beige pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-mihrab">{comment.userName}</p>
                          <p className="text-xs text-mihrab-dark/60">
                            {new Date(comment.date).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex">
                          {renderStars(comment.rating)}
                        </div>
                      </div>
                      <p className="text-mihrab-dark/80">{comment.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-mihrab-dark mb-4">قم بتسجيل الدخول لإضافة تقييمك</p>
                  <Button className="bg-mihrab hover:bg-mihrab-dark">
                    إضافة تقييم
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="p-6">
                <h2 className="text-xl font-heading font-bold text-mihrab mb-6">روايات قد تعجبك</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="novel-card">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="أسرار الصوفية"
                        className="novel-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg font-bold text-mihrab mb-1">أسرار الصوفية</h3>
                      <p className="text-sm text-mihrab-dark/70 mb-2">تأليف: محراب التوبة</p>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          {renderStars(4.5)}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          معرفة المزيد
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="novel-card">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="طريق المريدين"
                        className="novel-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg font-bold text-mihrab mb-1">طريق المريدين</h3>
                      <p className="text-sm text-mihrab-dark/70 mb-2">تأليف: محراب التوبة</p>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          {renderStars(4.7)}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          معرفة المزيد
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="novel-card">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="سراج المعرفة"
                        className="novel-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg font-bold text-mihrab mb-1">سراج المعرفة</h3>
                      <p className="text-sm text-mihrab-dark/70 mb-2">تأليف: محراب التوبة</p>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          {renderStars(4.6)}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          معرفة المزيد
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NovelDetail;
