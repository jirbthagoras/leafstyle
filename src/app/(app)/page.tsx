'use client'

import dynamic from 'next/dynamic'
import HeroSection from "@/components/Home/HeroSection";

// Dynamic imports with ssr disabled
const AISection = dynamic(() => import("@/components/Home/AiSection"), { ssr: false });
const MarketplaceSection = dynamic(() => import("@/components/Home/JB"), { ssr: false });
const CommunitySection = dynamic(() => import("@/components/Home/Community"), { ssr: false });
const Footer = dynamic(() => import("@/components/Home/Footer"), { ssr: false });

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