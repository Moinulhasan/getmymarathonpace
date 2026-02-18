import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import InstantToolsSection from "@/components/sections/InstantToolsSection";
import PerformanceDashboardSection from "@/components/sections/PerformanceDashboardSection";
import VO2MaxSection from "@/components/sections/VO2MaxSection";
import AudioCoachingSection from "@/components/sections/AudioCoachingSection";
import FeaturesGridSection from "@/components/sections/FeaturesGridSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <InstantToolsSection />
        <ProblemSection />
        <HowItWorksSection />
        <PerformanceDashboardSection />
        <VO2MaxSection />
        <AudioCoachingSection />
        <FeaturesGridSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
