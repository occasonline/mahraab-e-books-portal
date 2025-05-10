
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import NovelEditor from "@/components/admin/NovelEditor";
import NovelsList from "@/components/admin/NovelsList";
import { useToast } from "@/components/ui/use-toast";

// مؤقتًا: سنستخدم هذه الدالة للتحقق من المستخدم المسؤول
// في النسخة النهائية، يجب استبدالها بنظام مصادقة حقيقي
const useAdmin = () => {
  // هذا مجرد تمثيل. يجب استبداله بنظام مصادقة حقيقي عند تكامل Supabase
  return {
    isAdmin: true, // لأغراض العرض، نفترض أن المستخدم هو مسؤول
    isLoading: false,
  };
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState("novels");
  const [editingNovel, setEditingNovel] = useState<string | null>(null);

  // إذا كان المستخدم غير مصرح له، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!isLoading && !isAdmin) {
    navigate("/login");
    toast({
      variant: "destructive",
      title: "غير مصرح بالوصول",
      description: "يرجى تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة",
    });
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p>جاري التحميل...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-mihrab-cream py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-heading font-bold text-mihrab">لوحة التحكم</h1>
              <div>
                <Button 
                  variant="outline" 
                  className="border-mihrab text-mihrab hover:bg-mihrab-cream"
                  onClick={() => navigate("/")}
                >
                  العودة إلى الموقع
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="novels">إدارة الروايات</TabsTrigger>
                <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
                <TabsTrigger value="settings">إعدادات الموقع</TabsTrigger>
              </TabsList>
              
              <TabsContent value="novels" className="space-y-6">
                {editingNovel ? (
                  <NovelEditor 
                    novelId={editingNovel} 
                    onCancel={() => setEditingNovel(null)} 
                    onSave={() => {
                      setEditingNovel(null);
                      toast({
                        title: "تم حفظ الرواية",
                        description: "تم حفظ التغييرات بنجاح",
                      });
                    }}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-heading font-bold text-mihrab">الروايات المنشورة</h2>
                      <Button 
                        className="bg-mihrab hover:bg-mihrab-dark"
                        onClick={() => setEditingNovel("new")}
                      >
                        إضافة رواية جديدة
                      </Button>
                    </div>
                    <NovelsList onEdit={setEditingNovel} />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="users">
                <div className="text-center py-8">
                  <h2 className="text-xl font-heading mb-4">إدارة المستخدمين</h2>
                  <p className="text-muted-foreground">
                    ستتوفر هذه الميزة قريبًا بعد تكامل نظام إدارة المستخدمين.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="text-center py-8">
                  <h2 className="text-xl font-heading mb-4">إعدادات الموقع</h2>
                  <p className="text-muted-foreground">
                    ستتوفر هذه الميزة قريبًا.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
