
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getNovelById } from "@/services/novelService";
import { Novel } from "@/types/supabase";
import NovelHeader from '@/components/novel/NovelHeader';
import NovelContentTabs from '@/components/novel/NovelContentTabs';
import NovelReader from '@/components/novel/NovelReader';
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
        console.log("Fetched novel:", fetchedNovel?.title);
        setNovel(fetchedNovel);
        
        // استخدام ملف EPUB تجريبي للآن بدلاً من محاولة استخدام نص الرواية كمسار
        console.log("Using sample EPUB file");
        setEpubUrl('/sample-book.epub');
        
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
      // استخدام القارئ العادي مع نص الرواية
      setIsReaderOpen(true);
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
          
          {/* قارئ الكتاب العادي */}
          <NovelReader 
            title={novel.title}
            content={novel.full_description || novel.sample || ''}
            isOpen={isReaderOpen}
            onClose={() => setIsReaderOpen(false)}
          />
          
          {/* قارئ EPUB البسيط */}
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
