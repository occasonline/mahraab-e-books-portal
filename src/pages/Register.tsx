
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: 'free',
    name: 'العضوية المجانية',
    price: 'مجاناً',
    features: [
      'الوصول إلى المحتوى الأساسي',
      'قراءة المقتطفات من الروايات',
      'المشاركة في المنتدى العام',
    ],
    recommended: false
  },
  {
    id: 'basic',
    name: 'العضوية الأساسية',
    price: '10$ / شهرياً',
    features: [
      'الوصول إلى جميع الروايات',
      'تحميل بتنسيق PDF',
      'ميزات القراءة المتقدمة',
      'خصومات على المنتجات',
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: 'عضوية VIP',
    price: '25$ / شهرياً',
    features: [
      'جميع ميزات العضوية الأساسية',
      'وصول مبكر للروايات الجديدة',
      'لقاءات خاصة مع المؤلف',
      'نسخ ورقية مجانية',
      'دعم فني مخصص',
    ],
    recommended: false
  }
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>(membershipPlans[0].id);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreeTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: !prev.agreeTerms,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate first step (password match)
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "خطأ في كلمة المرور",
          description: "كلمة المرور وتأكيدها غير متطابقين",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else {
      // Submit the form
      setIsSubmitting(true);
      
      // Simulate registration request
      setTimeout(() => {
        toast({
          title: "تم التسجيل بنجاح",
          description: "مرحباً بك في مجتمع محراب التوبة!",
        });
        navigate('/');
        setIsSubmitting(false);
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen bg-mihrab-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="mx-auto w-16 h-16 rounded-full bg-mihrab flex items-center justify-center">
              <span className="text-white font-heading text-3xl">م</span>
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-heading font-bold text-mihrab">إنشاء حساب جديد</h1>
          <p className="mt-2 text-sm text-mihrab-dark/70">
            انضم إلى مجتمع محراب التوبة واستمتع بتجربة قراءة فريدة من نوعها
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="my-8 relative">
          <div className="flex justify-between">
            <div className="text-center">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-mihrab text-white' : 'bg-mihrab-gold text-white'
              }`}>
                1
              </div>
              <div className="mt-2 text-sm font-medium text-mihrab">معلومات الحساب</div>
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-mihrab text-white' : 'bg-mihrab-beige text-mihrab-dark'
              }`}>
                2
              </div>
              <div className="mt-2 text-sm font-medium text-mihrab">اختيار العضوية</div>
            </div>
          </div>
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-mihrab-beige">
            <div className={`h-full bg-mihrab-gold transition-all duration-300 ${
              step === 1 ? 'w-0' : 'w-full'
            }`}></div>
          </div>
        </div>
        
        {/* Registration Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                {/* Step 1: Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-mihrab mb-1">
                      الاسم الأول
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="border-mihrab-beige focus:border-mihrab"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-mihrab mb-1">
                      الاسم الأخير
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="border-mihrab-beige focus:border-mihrab"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-mihrab mb-1">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="border-mihrab-beige focus:border-mihrab"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-mihrab mb-1">
                      البلد
                    </label>
                    <Select value={formData.country} onValueChange={handleSelectChange}>
                      <SelectTrigger className="border-mihrab-beige focus:border-mihrab focus:ring-mihrab">
                        <SelectValue placeholder="اختر البلد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                        <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                        <SelectItem value="kw">الكويت</SelectItem>
                        <SelectItem value="qa">قطر</SelectItem>
                        <SelectItem value="bh">البحرين</SelectItem>
                        <SelectItem value="om">عمان</SelectItem>
                        <SelectItem value="eg">مصر</SelectItem>
                        <SelectItem value="jo">الأردن</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-mihrab mb-1">
                      كلمة المرور
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="border-mihrab-beige focus:border-mihrab"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-mihrab mb-1">
                      تأكيد كلمة المرور
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border-mihrab-beige focus:border-mihrab"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={handleCheckboxChange}
                    className="text-mihrab border-mihrab-beige"
                    required
                  />
                  <label htmlFor="agreeTerms" className="mr-2 block text-sm text-mihrab-dark">
                    أوافق على{' '}
                    <Link to="/terms" className="text-mihrab hover:text-mihrab-gold">
                      شروط الاستخدام
                    </Link>
                    {' '}و{' '}
                    <Link to="/privacy" className="text-mihrab hover:text-mihrab-gold">
                      سياسة الخصوصية
                    </Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-mihrab hover:bg-mihrab-dark"
                >
                  التالي
                </Button>
              </>
            ) : (
              <>
                {/* Step 2: Membership Selection */}
                <h3 className="text-xl font-heading font-bold text-mihrab mb-4">
                  اختر خطة العضوية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {membershipPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id 
                          ? 'border-mihrab-gold ring-2 ring-mihrab-gold shadow-md' 
                          : 'border-mihrab-beige hover:border-mihrab'
                      } ${plan.recommended ? 'relative' : ''}`}
                    >
                      {plan.recommended && (
                        <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 text-center">
                          <span className="bg-mihrab-gold text-white text-xs font-bold py-1 px-4 rounded-full">
                            موصى به
                          </span>
                        </div>
                      )}
                      
                      <h4 className="text-lg font-heading font-bold text-mihrab mb-2">
                        {plan.name}
                      </h4>
                      <p className="text-xl font-bold text-mihrab-dark mb-4">
                        {plan.price}
                      </p>
                      
                      <ul className="text-sm text-mihrab-dark/80 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="w-4 h-4 text-mihrab-gold flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-mihrab text-mihrab hover:bg-mihrab-cream"
                    onClick={() => setStep(1)}
                  >
                    الرجوع
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-mihrab hover:bg-mihrab-dark md:w-1/3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري التسجيل...' : 'إنشاء الحساب'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
        
        <p className="text-center text-sm text-mihrab-dark/70 mt-6">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-medium text-mihrab hover:text-mihrab-gold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
