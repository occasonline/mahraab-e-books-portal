import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getNovelById } from "@/services/novelService";
import { getEpubDownloadUrl } from "@/services/epubService";
import { Novel } from "@/types/supabase";
import NovelHeader from '@/components/novel/NovelHeader';
import NovelContentTabs from '@/components/novel/NovelContentTabs';
import NovelReader from '@/components/novel/NovelReader';
import EpubReader from '@/components/novel/EpubReader';
import { createSafeEpubPath, slugify } from '@/lib/slugUtils';
import SimpleEpubViewer from '@/components/novel/epub/SimpleEpubViewer';

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isEpubReaderOpen, setIsEpubReaderOpen] = useState(false);
  const [epubUrl, setEpubUrl] = useState<string>('');
  const [loadingEpub, setLoadingEpub] = useState(false);
  
  // Mock comments for now - could be replaced with real data in future
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

  // Fetch the specific novel based on the id
  useEffect(() => {
    const fetchNovel = async () => {
      if (!id) {
        navigate('/novels');
        return;
      }
      
      try {
        const fetchedNovel = await getNovelById(id);
        console.log("Fetched novel content length:", fetchedNovel?.full_description?.length || 0);
        console.log("Fetched novel sample:", fetchedNovel?.sample);
        setNovel(fetchedNovel);
        
        // تحميل عنوان ملف EPUB إذا كان متاحاً
        if (fetchedNovel?.sample) {
          try {
            setLoadingEpub(true);
            console.log("جار تحميل EPUB من:", fetchedNovel.sample);
            
            // إنشاء مسار آمن للـ URL إذا كان لدينا عنوان للكتاب
            let epubPath = fetchedNovel.sample;
            
            // التعامل مع الأسماء المعقدة التي تحتوي على علامات #
            if (epubPath.includes('#')) {
              // استخدام اسم ملف آمن بناءً على عنوان الكتاب
              const safeFileName = createSafeEpubPath(fetchedNovel.title);
              console.log("تحويل مسار معقد إلى مسار آمن:", safeFileName);
              epubPath = safeFileName;
            }
            
            // الحصول على رابط التحميل
            const url = await getEpubDownloadUrl(epubPath);
            console.log("EPUB URL:", url);
            setEpubUrl(url);
            
          } catch (epubError) {
            console.error("Error fetching EPUB URL:", epubError);
            toast({
              variant: "destructive",
              title: "خطأ في تحميل الكتاب",
              description: "حدث خطأ أثناء تحميل الكتاب الإلكتروني. سيتم استخدام نموذج بديل.",
            });
            setEpubUrl('/sample-book.epub'); // استخدام ملف تجريبي في حالة الخطأ
          } finally {
            setLoadingEpub(false);
          }
        } else {
          console.log("Using sample EPUB");
          // استخدام ملف EPUB تجريبي للعرض
          setEpubUrl('/sample-book.epub');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching novel:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الرواية",
          description: "لم نتمكن من تحميل بيانات الرواية. يرجى المحاولة مرة أخرى لاحقاً.",
        });
        setLoading(false);
      }
    };

    fetchNovel();
  }, [id, navigate, toast]);
  
  const handleStartReading = () => {
    if (novel?.is_premium) {
      toast({
        title: "هذه الرواية حصرية",
        description: "يرجى الترقية إلى العضوية المدفوعة للوصول إلى هذه الرواية.",
      });
    } else {
      // استخدام القارئ البسيط الجديد
      if (epubUrl && epubUrl !== '/sample-book.epub') {
        setIsEpubReaderOpen(true);
      } else {
        setIsReaderOpen(true);
      }
    }
  };
  
  const handleDownload = (format: string) => {
    toast({
      title: `جاري تحميل الرواية`,
      description: `تم بدء تحميل الرواية بتنسيق ${format}`,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-mihrab-cream py-12">
          <div className="container mx-auto px-4 text-center">
            <p>جاري تحميل بيانات الرواية...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!novel) {
    return (
      <Layout>
        <div className="bg-mihrab-cream py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-heading font-bold text-mihrab mb-4">الرواية غير موجودة</h2>
            <p className="mb-6">لم نتمكن من العثور على الرواية المطلوبة</p>
            <Button onClick={() => navigate('/novels')} className="bg-mihrab hover:bg-mihrab-dark">
              العودة إلى الروايات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-mihrab-cream py-12">
        <div className="container mx-auto px-4">
          {/* Novel Header Component */}
          <NovelHeader
            novel={novel}
            onStartReading={handleStartReading}
            onDownload={handleDownload}
            onOpenEpubReader={() => setIsEpubReaderOpen(true)}
            hasEpub={!!epubUrl}
          />
          
          {/* Novel Content Tabs Component */}
          <NovelContentTabs
            novel={novel}
            comments={comments}
            onStartReading={handleStartReading}
            onOpenEpubReader={() => setIsEpubReaderOpen(true)}
            hasEpub={!!epubUrl}
          />
          
          {/* قارئ الكتاب القديم - سنبقيه كنسخة احتياطية */}
          <NovelReader 
            title={novel.title}
            content={novel.full_description || novel.sample || ''}
            isOpen={isReaderOpen}
            onClose={() => setIsReaderOpen(false)}
          />
          
          {/* قارئ EPUB الجديد */}
          <SimpleEpubViewer
            title={novel.title}
            url={epubUrl}
            isOpen={isEpubReaderOpen}
            onClose={() => setIsEpubReaderOpen(false)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default NovelDetail;
