import HeroSection from "./components/HeroSection";
import AISection from "./components/AiSection";
import MarketplaceSection from "./components/JB";
import CommunitySection from "./components/Community";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <AISection />
      <MarketplaceSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}

