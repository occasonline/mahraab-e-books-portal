
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedNovels from "@/components/home/FeaturedNovels";
import About from "@/components/home/About";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedNovels />
      <About />
      <Features />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
