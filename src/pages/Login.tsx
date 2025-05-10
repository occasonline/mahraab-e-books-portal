
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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
      rememberMe: !prev.rememberMe,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login request
    setTimeout(() => {
      // For demo purposes, consider any login successful
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في محراب التوبة!",
      });
      navigate('/');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-mihrab-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="mx-auto w-16 h-16 rounded-full bg-mihrab flex items-center justify-center">
              <span className="text-white font-heading text-3xl">م</span>
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-heading font-bold text-mihrab">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-mihrab-dark/70">
            مرحباً بعودتك إلى عالم محراب التوبة
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <label htmlFor="password" className="block text-sm font-medium text-mihrab mb-1">
                كلمة المرور
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="border-mihrab-beige focus:border-mihrab"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  className="text-mihrab border-mihrab-beige"
                />
                <label htmlFor="rememberMe" className="mr-2 block text-sm text-mihrab-dark">
                  تذكرني
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-mihrab hover:text-mihrab-gold">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>
            
            <div>
              <Button 
                type="submit" 
                className="w-full bg-mihrab hover:bg-mihrab-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mihrab-beige"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-mihrab-dark">أو</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-mihrab-beige rounded-md shadow-sm bg-white text-sm font-medium text-mihrab-dark hover:bg-mihrab-cream"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
                <span className="mr-2">فيسبوك</span>
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-mihrab-beige rounded-md shadow-sm bg-white text-sm font-medium text-mihrab-dark hover:bg-mihrab-cream"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M 12.545 10.239 v 3.821 h 5.445 c -0.712 2.315 -2.647 3.972 -5.445 3.972 a 6.033 6.033 0 0 1 -6.056 -6.054 a 6.03 6.03 0 0 1 6.056 -6.053 c 1.49 0 2.828 0.503 3.88 1.345 l 2.862 -2.862 A 10.68 10.68 0 0 0 12.545 2 a 10.053 10.053 0 0 0 -10.054 10.054 c 0 5.556 4.5 10.054 10.054 10.054 c 8.528 0 10.527 -8.196 9.682 -12.062 z" fill="currentColor"></path>
                </svg>
                <span className="mr-2">جوجل</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-mihrab-dark/70">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="font-medium text-mihrab hover:text-mihrab-gold">
            سجل الآن
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
