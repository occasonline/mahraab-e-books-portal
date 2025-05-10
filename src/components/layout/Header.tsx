
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 rounded-full bg-mihrab flex items-center justify-center">
              <span className="text-white font-heading text-xl">م</span>
            </div>
            <h1 className="text-mihrab font-heading text-2xl font-bold">محراب التوبة</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active-nav-link' : ''}`}>الرئيسية</Link>
            <Link to="/novels" className={`nav-link ${isActive('/novels') ? 'active-nav-link' : ''}`}>الروايات</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active-nav-link' : ''}`}>عن المؤلف</Link>
            <Link to="/faq" className={`nav-link ${isActive('/faq') ? 'active-nav-link' : ''}`}>الأسئلة الشائعة</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active-nav-link' : ''}`}>اتصل بنا</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
            <Button variant="ghost" size="icon" className="text-mihrab hover:text-mihrab-gold hover:bg-mihrab-cream">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline" className="border-mihrab text-mihrab hover:bg-mihrab-cream">
                دخول
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-mihrab hover:bg-mihrab-dark">
                تسجيل
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-mihrab"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-md ${isActive('/') ? 'bg-mihrab-cream text-mihrab' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/novels" 
                className={`px-4 py-2 rounded-md ${isActive('/novels') ? 'bg-mihrab-cream text-mihrab' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                الروايات
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-2 rounded-md ${isActive('/about') ? 'bg-mihrab-cream text-mihrab' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                عن المؤلف
              </Link>
              <Link 
                to="/faq" 
                className={`px-4 py-2 rounded-md ${isActive('/faq') ? 'bg-mihrab-cream text-mihrab' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                الأسئلة الشائعة
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-2 rounded-md ${isActive('/contact') ? 'bg-mihrab-cream text-mihrab' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
            </nav>
            <div className="flex space-x-2 space-x-reverse mt-4 pt-4 border-t">
              <Link 
                to="/login" 
                className="flex-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full border-mihrab text-mihrab">
                  <User className="h-4 w-4 ml-2" />
                  دخول
                </Button>
              </Link>
              <Link 
                to="/register" 
                className="flex-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-mihrab hover:bg-mihrab-dark">
                  تسجيل
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
