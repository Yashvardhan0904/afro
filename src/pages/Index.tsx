import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustBadges from "@/components/TrustBadges";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBadges />
      <CategoryGrid />
      <FeaturedProducts />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
