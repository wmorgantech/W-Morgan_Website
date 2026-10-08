import { motion } from "framer-motion";
import { Brain, Cloud, Globe, Smartphone, Database, Bot } from "lucide-react";
import SectionTitle from "../common/SectionTitle";

const technologies = [
  { label: "AI", icon: Brain },
  { label: "Cloud", icon: Cloud },
  { label: "Web", icon: Globe },
  { label: "Mobile", icon: Smartphone },
  { label: "Data", icon: Database },
  { label: "Automation", icon: Bot },
];

const positions = [
  "left-[12%] top-[6%]",
  "right-[12%] top-[6%]",
  "left-[-2%] top-1/2 -translate-y-1/2",
  "right-[-2%] top-1/2 -translate-y-1/2",
  "left-[12%] bottom-[6%]",
  "right-[12%] bottom-[6%]",
];

function Node({ item, className = "", index = 0 }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`group flex items-center gap-2.5 rounded-full border border-white/12 bg-[#0d1b14]/85 py-1.5 pl-1.5 pr-4 backdrop-blur-md transition-all duration-300 hover:border-[#7be0b4]/60 hover:bg-[#12261c] ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7be0b4]/12 text-[#7be0b4] transition-colors duration-300 group-hover:bg-[#7be0b4] group-hover:text-[#0d1b14]">
        <Icon size={15} strokeWidth={1.8} />
      </span>
      <span className="text-xs font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
        {item.label}
      </span>
    </motion.div>
  );
}

function DigitalDNASection() {
  return (
    <section className="surface-dark on-dark relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionTitle
          light
          align="center"
          eyebrow="Digital DNA"
          title={
            <>
              Connecting technology{" "}
              <span className="text-[#ff3b30]">with impact.</span>
            </>
          }
        />

        {/* Desktop / Tablet */}
        <div className="relative mx-auto mt-12 hidden h-[360px] max-w-2xl items-center justify-center md:flex">
          {/* Orbits */}
          <div className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-white/12" />
          <div className="absolute h-[230px] w-[230px] rounded-full border border-[#7be0b4]/25" />
          <div
            aria-hidden="true"
            className="absolute h-[200px] w-[200px] rounded-full bg-[radial-gradient(closest-side,rgba(47,170,125,0.28),transparent)]"
          />

          {/* Center */}
          <div className="relative z-10 flex h-[96px] w-[96px] items-center justify-center rounded-full border border-[#7be0b4]/40 bg-[#0d1b14] shadow-[0_0_60px_rgba(47,170,125,0.35)]">
            <div className="text-center">
              <div className="font-serif text-[34px] italic leading-none text-[#7be0b4]">W</div>
              <div className="mt-1 font-mono text-[7px] font-medium uppercase tracking-[0.2em] text-white/50">
                Technologies
              </div>
            </div>
          </div>

          {technologies.map((item, index) => (
            <Node
              key={item.label}
              item={item}
              index={index}
              className={`absolute ${positions[index]}`}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:hidden">
          {technologies.map((item, index) => (
            <Node key={item.label} item={item} index={index} className="w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DigitalDNASection;
