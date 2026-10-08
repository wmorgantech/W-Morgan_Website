import { motion } from "framer-motion";
import AboutSection from "../components/sections/AboutSection";
import WhyMorganSection from "../components/sections/WhyMorganSection";
import TeamSection from "../components/sections/TeamSection";
import DigitalDNASection from "../components/sections/DigitalDNASection";
import ProcessSection from "../components/sections/ProcessSection";
import FinalCTASection from "../components/sections/FinalCTASection";
import heroImg from "../assets/img5.jpeg";

const ease = [0.22, 1, 0.36, 1];

export default function About() {
  return (
    <div className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* HERO: light, typographic, with a wide cinematic visual */}
      <section className="border-b border-[#0e1411]/10 bg-[#f6f6f1]">
        <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 md:pt-20 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
              className="lg:col-span-8"
            >
              <p className="eyebrow">About Us</p>
              <h1 className="display mt-6 text-[clamp(2.6rem,6.2vw,5.25rem)] leading-[0.98] text-[#0e1411]">
                Building digital
                <br />
                <span className="text-[#ff3b30]">experiences that matter.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease }}
              className="lead border-l border-[#176b4d]/40 pl-5 lg:col-span-4"
            >
              We are a software engineering & product team built for ambitious businesses that want
              scalable systems, modern code bases, and measurable results.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease }}
            className="frame frame-ring mt-12 aspect-[21/9] rounded-2xl shadow-[0_40px_80px_-40px_rgba(8,18,13,0.6)] md:mt-16"
          >
            <img src={heroImg} alt="" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#08120d]/50 via-transparent to-transparent"
            />
          </motion.div>
          <div aria-hidden="true" className="h-12 md:h-16" />
        </div>
      </section>

      <AboutSection />
      <WhyMorganSection />
      <TeamSection />
      <DigitalDNASection />
      <ProcessSection />
      <FinalCTASection />
    </div>
  );
}
