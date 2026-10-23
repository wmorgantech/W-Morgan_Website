import HeroSection from "../components/sections/HeroSection";
import TrustedClients from "../components/sections/TrustedClients";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import PortfolioSection from "../components/sections/PortfolioSection";
import IndustriesSection from "../components/sections/IndustriesSection";
import TechnologySection from "../components/sections/TechnologySection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ImpactMetricsSection from "../components/sections/ImpactMetricsSection";
import FinalCTASection from "../components/sections/FinalCTASection";
import { usePageMeta } from "../hooks/usePageMeta";

/*
 * Each kind of content has one home so nothing is repeated across pages:
 *   - company values  -> About page (WhyMorganSection)
 *   - how we work     -> Services page (ProcessSection)
 *   - services, projects, clients, testimonials -> Admin-managed via the API
 */
export default function Home() {
  usePageMeta({
    fullTitle: "W Morgan Technologies | Digital Product Engineering",
    description:
      "W Morgan Technologies designs and engineers digital products, platforms and intelligent solutions that help businesses operate, scale and grow.",
  });

  return (
    <div className="bg-white text-[#0e1411]">
      <HeroSection />
      <TrustedClients />
      <AboutSection />
      <ServicesSection />
      <ImpactMetricsSection />
      <TestimonialsSection />
      <PortfolioSection />
      <IndustriesSection />
      <TechnologySection />
      <FinalCTASection
        heading="Have an Idea?"
        accent="Let's Build It."
        description="Ready to turn your vision into a digital product? Let's make it happen."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryLabel="Explore Our Work"
        secondaryHref="/portfolio"
      />
    </div>
  );
}
