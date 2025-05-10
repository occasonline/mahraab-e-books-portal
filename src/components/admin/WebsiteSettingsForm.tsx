import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getWebsiteSettings, updateWebsiteSettings } from "@/services/settingsService";
import {
  Globe,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  PaintBucket,
} from "lucide-react";

// Define the schema for website settings
const websiteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "اسم الموقع مطلوب" }),
  siteDescription: z.string(),
  // Theme settings
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "يرجى إدخال لون صحيح (مثال: #6d4d3c)",
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "يرجى إدخال لون صحيح (مثال: #f4eee2)",
  }),
  // Contact information
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  phone: z.string(),
  address: z.string(),
  // Social media
  facebook: z.string().url({ message: "يرجى إدخال رابط صحيح" }).or(z.string().length(0)),
  twitter: z.string().url({ message: "يرجى إدخال رابط صحيح" }).or(z.string().length(0)),
  instagram: z.string().url({ message: "يرجى إدخال رابط صحيح" }).or(z.string().length(0)),
});

type WebsiteSettingsFormValues = z.infer<typeof websiteSettingsSchema>;

// Default settings for initial form values
const defaultSettings: WebsiteSettingsFormValues = {
  siteName: "محراب التوبة",
  siteDescription: "عالم أدبي فريد يجمع بين الروحانية والفلسفة",
  primaryColor: "#6d4d3c",
  secondaryColor: "#f4eee2",
  email: "info@mihrab-altawba.com",
  phone: "+123456789",
  address: "المملكة العربية السعودية",
  facebook: "https://facebook.com/mihrab-altawba",
  twitter: "https://twitter.com/mihrab-altawba",
  instagram: "https://instagram.com/mihrab-altawba",
};

const WebsiteSettingsForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form definition
  const form = useForm<WebsiteSettingsFormValues>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: defaultSettings,
  });

  // استرجاع إعدادات الموقع عند تحميل المكون
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getWebsiteSettings();
        if (settings) {
          form.reset({
            siteName: settings.site_name,
            siteDescription: settings.site_description,
            primaryColor: settings.primary_color,
            secondaryColor: settings.secondary_color,
            email: settings.email,
            phone: settings.phone,
            address: settings.address,
            facebook: settings.facebook || "",
            twitter: settings.twitter || "",
            instagram: settings.instagram || "",
          });
        }
      } catch (error) {
        console.error("خطأ في استرجاع إعدادات الموقع:", error);
        // لا نعرض رسالة خطأ هنا لأنه من المحتمل أنها المرة الأولى التي يتم فيها تعيين الإعدادات
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  // Form submission handler
  const onSubmit = async (data: WebsiteSettingsFormValues) => {
    setIsSubmitting(true);
    
    try {
      await updateWebsiteSettings({
        site_name: data.siteName,
        site_description: data.siteDescription,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        email: data.email,
        phone: data.phone,
        address: data.address,
        facebook: data.facebook,
        twitter: data.twitter,
        instagram: data.instagram
      });
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الموقع بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
      });
      console.error("خطأ في حفظ إعدادات الموقع:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">معلومات عامة</TabsTrigger>
              <TabsTrigger value="theme">التصميم</TabsTrigger>
              <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">معلومات الموقع الأساسية</CardTitle>
                  <CardDescription>
                    إعدادات عامة للموقع مثل الاسم والوصف
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الموقع</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="محراب التوبة" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف الموقع</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="وصف قصير للموقع" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Theme Settings */}
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">إعدادات التصميم</CardTitle>
                  <CardDescription>
                    تخصيص ألوان وتصميم الموقع
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اللون الرئيسي</FormLabel>
                          <div className="flex space-x-2 space-x-reverse">
                            <FormControl>
                              <Input {...field} placeholder="#6d4d3c" />
                            </FormControl>
                            <div 
                              className="w-10 h-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            >
                              <PaintBucket className="h-4 w-4 text-white/70 m-1" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اللون الثانوي</FormLabel>
                          <div className="flex space-x-2 space-x-reverse">
                            <FormControl>
                              <Input {...field} placeholder="#f4eee2" />
                            </FormControl>
                            <div 
                              className="w-10 h-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            >
                              <PaintBucket className="h-4 w-4 text-black/70 m-1" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">معاينة</h3>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-full h-12 rounded-md flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: form.watch("primaryColor") }}
                      >
                        زر رئيسي
                      </div>
                      <div 
                        className="w-full h-12 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: form.watch("secondaryColor"), color: form.watch("primaryColor") }}
                      >
                        زر ثانوي
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Contact Settings */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">معلومات الاتصال</CardTitle>
                  <CardDescription>
                    معلومات التواصل ووسائل التواصل الاجتماعي
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            البريد الإلكتروني
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="info@example.com" dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            رقم الهاتف
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+123456789" dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          العنوان
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="المملكة العربية السعودية" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <h3 className="text-lg font-medium pt-4">حسابات التواصل الاجتماعي</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Facebook className="h-4 w-4" />
                            فيسبوك
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/..." dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            تويتر
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/..." dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            انستغرام
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://instagram.com/..." dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-mihrab hover:bg-mihrab-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WebsiteSettingsForm;
