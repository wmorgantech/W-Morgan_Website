import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the business, users and goals.",
  },
  {
    number: "02",
    title: "Design",
    description: "Turn ideas into intuitive experiences.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Build reliable products with modern practices.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "Launch securely on scalable infrastructure.",
  },
  {
    number: "05",
    title: "Grow",
    description: "Measure, improve and keep evolving.",
  },
];

const ease = [0.22, 1, 0.36, 1];

function ProcessSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionTitle
          eyebrow="Our Process"
          title={
            <>
              From idea to{" "}
              <span className="text-[#176b4d]">real impact.</span>
            </>
          }
          description="A clear, practical workflow designed to move products from idea to launch and beyond."
        />

        {/* Desktop: one connected line that draws in as the section appears */}
        <div className="mt-14 hidden lg:block">
          <div className="relative">
            <div className="absolute inset-x-0 top-[7px] h-px bg-[#0e1411]/10" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease }}
              className="absolute inset-x-0 top-[7px] h-px origin-left bg-gradient-to-r from-[#2faa7d] via-[#2faa7d] to-[#ff3b30]"
            />

            <ol className="relative grid grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease }}
                  className="group relative"
                >
                  <span
                    className={`relative z-10 block h-[15px] w-[15px] rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(14,20,17,0.2)] transition-transform duration-300 group-hover:scale-125 ${
                      index === steps.length - 1 ? "bg-[#ff3b30]" : "bg-[#176b4d]"
                    }`}
                  />

                  <span
                    aria-hidden="true"
                    className="mt-5 block select-none text-[4.5rem] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(14,20,17,0.3)] transition-[-webkit-text-stroke-color] duration-300 group-hover:[-webkit-text-stroke-color:#2faa7d]"
                  >
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-[#0e1411]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[13rem] text-[13px] leading-6 text-[#5c655f]">
                    {step.description}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile / tablet: vertical rail */}
        <ol className="mt-10 lg:hidden">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05, ease }}
              className="relative border-l border-[#0e1411]/12 pb-8 pl-8 last:border-transparent last:pb-0"
            >
              <span
                className={`absolute -left-[7px] top-1 h-[13px] w-[13px] rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(14,20,17,0.2)] ${
                  index === steps.length - 1 ? "bg-[#ff3b30]" : "bg-[#176b4d]"
                }`}
              />
              <span className="chip-num">{step.number}</span>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#0e1411]">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-[#5c655f]">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ProcessSection;
