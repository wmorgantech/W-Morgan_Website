import HeroSection from "../components/sections/HeroSection";
import TrustedClients from "../components/sections/TrustedClients";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import PortfolioSection from "../components/sections/PortfolioSection";
import IndustriesSection from "../components/sections/IndustriesSection";
import TechnologySection from "../components/sections/TechnologySection";
import WhyMorganSection from "../components/sections/WhyMorganSection";
import ProcessSection from "../components/sections/ProcessSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FinalCTASection from "../components/sections/FinalCTASection";

export default function Home() {
  return (
    <div className="bg-white text-[#0e1411]">
      <HeroSection />
      <TrustedClients />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <IndustriesSection />
      <TechnologySection />
      <WhyMorganSection />
      <ProcessSection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  );
}
