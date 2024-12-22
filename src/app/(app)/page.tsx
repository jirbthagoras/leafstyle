import HeroSection from "@/components/Home/HeroSection";
import AISection from "@/components/Home/AiSection";
import MarketplaceSection from "@/components/Home/JB";
import CommunitySection from "@/components/Home/Community";
import Footer from "@/components/Home/Footer";
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