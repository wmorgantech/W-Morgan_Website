import { motion } from "framer-motion";
import Reveal from "../common/Reveal";

const steps = [
  { number: "01", title: "Discover", description: "Understand the business, users and goals." },
  { number: "02", title: "Design", description: "Turn ideas into intuitive experiences." },
  { number: "03", title: "Engineer", description: "Build reliable products with modern practices." },
  { number: "04", title: "Deploy", description: "Launch securely on scalable infrastructure." },
  { number: "05", title: "Grow", description: "Measure, improve and keep evolving." },
];

const ease = [0.22, 1, 0.36, 1];

/**
 * The workflow as a horizontal five-step timeline. The green line draws across and the markers
 * fill one after another when it scrolls into view. On small screens it becomes a compact
 * vertical list, so nothing overflows sideways.
 */
function ProcessSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Our Process</p>
            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
              From idea to <span className="text-[#176b4d]">real impact.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5c655f]">
            A clear, practical workflow from the first idea to launch and beyond.
          </p>
        </Reveal>

        <ol className="relative mt-10 grid gap-7 md:grid-cols-5 md:gap-5">
          {/* connecting line (desktop): grey track with a green fill that draws in */}
          <span aria-hidden="true" className="absolute left-4 right-4 top-[15px] hidden h-px bg-[#0e1411]/12 md:block" />
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease }}
            className="absolute left-4 right-4 top-[15px] hidden h-px origin-left bg-gradient-to-r from-[#176b4d] to-[#2faa7d] md:block"
          />

          {steps.map((step, index) => (
            <li key={step.title} className="group relative pl-12 md:pl-0">
              {/* vertical connector (mobile) */}
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute bottom-[-1.75rem] left-[15px] top-8 w-px bg-[#176b4d]/30 md:hidden" />
              )}

              <motion.span
                initial={{ backgroundColor: "#ffffff", color: "#176b4d" }}
                whileInView={{ backgroundColor: "#176b4d", color: "#ffffff" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: 0.25 + index * 0.25 }}
                className="absolute left-0 top-0 z-10 flex h-[31px] w-[31px] items-center justify-center rounded-full border-2 border-[#176b4d] font-mono text-[10px] font-semibold transition-shadow duration-300 group-hover:shadow-[0_0_0_5px_rgba(47,170,125,0.2)] md:static"
              >
                {step.number}
              </motion.span>

              <h3 className="text-base font-semibold tracking-tight text-[#0e1411] md:mt-4">{step.title}</h3>
              <p className="mt-1 max-w-[16rem] text-[13px] leading-5 text-[#5c655f]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ProcessSection;
