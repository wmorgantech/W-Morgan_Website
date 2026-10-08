import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";

const ease = [0.22, 1, 0.36, 1];

const reasons = [
  {
    title: "Business First",
    description: "Every decision starts with the outcome we want to create.",
  },
  {
    title: "Built to Scale",
    description: "Systems that evolve with your users, data and operations.",
  },
  {
    title: "Modern Engineering",
    description: "Secure, maintainable and high-performance products.",
  },
  {
    title: "Long-Term Partnership",
    description: "We stay involved after launch to improve and support.",
  },
];

function WhyMorganSection() {
  return (
    <section className="bg-[#f6f6f1] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionTitle
                eyebrow="Why W Morgan"
                title={
                  <>
                    We build for <span className="text-[#ff3b30]">the long run.</span>
                  </>
                }
              />
            </div>
          </div>

          {/* Editorial numbered list */}
          <ol className="lg:col-span-7">
            {reasons.map((reason, index) => (
              <motion.li
                key={reason.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.06, ease }}
                className="group relative grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 border-t border-[#0e1411]/12 py-6 last:border-b sm:grid-cols-[5rem_1fr] md:py-7"
              >
                {/* hover sweep */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[-1px] h-px origin-left scale-x-0 bg-[#2faa7d] transition-transform duration-500 group-hover:scale-x-100"
                />

                <span className="font-serif text-4xl italic leading-none text-[#176b4d]/70 transition-colors duration-300 group-hover:text-[#176b4d] sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="sm:grid sm:grid-cols-[1fr_1.1fr] sm:items-baseline sm:gap-6">
                  <h3 className="text-xl font-semibold tracking-tight text-[#0e1411]">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#5c655f] sm:mt-0">
                    {reason.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default WhyMorganSection;
