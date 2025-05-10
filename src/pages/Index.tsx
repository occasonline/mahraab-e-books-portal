
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedNovels from "@/components/home/FeaturedNovels";
import About from "@/components/home/About";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedNovels />
      <About />
      <Features />
      <Testimonials />
      <CallToAction />
      
      {/* رابط لوحة التحكم (سيتم إخفاؤه أو إظهاره بناءً على صلاحيات المستخدم لاحقًا) */}
      <div className="bg-mihrab py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <Link to="/admin">
            <Button className="bg-mihrab-dark hover:bg-mihrab-dark/90">
              لوحة التحكم (للمسؤولين)
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
