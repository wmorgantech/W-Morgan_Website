import { motion } from "framer-motion";
import { Lightbulb, Code2, Cloud, Users } from "lucide-react";
import aboutImg from "../../assets/img2.jpeg";

const ease = [0.22, 1, 0.36, 1];

const principles = [
  {
    icon: Lightbulb,
    title: "Product Thinking",
    text: "We start with the problem and design around real business goals.",
  },
  {
    icon: Code2,
    title: "Modern Engineering",
    text: "Clean architecture, performance and maintainability by default.",
  },
  {
    icon: Cloud,
    title: "Scalable Systems",
    text: "Web, cloud, AI and data built to grow with the business.",
  },
  {
    icon: Users,
    title: "Long-Term Partnership",
    text: "Support, optimisation and continuous improvement after launch.",
  },
];

const metrics = [
  { value: "Custom", label: "Tailored Software Engineering" },
  { value: "Agile", label: "Rapid Product Delivery" },
];

export default function AboutSection() {
  return (
    <section className="bg-[#f6f6f1] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-5 lg:pt-6"
          >
            <p className="eyebrow">Who We Are</p>

            <h2 className="display mt-6 text-[clamp(2rem,4vw,3.25rem)] text-[#0e1411]">
              We turn ideas into{" "}
              <span className="text-[#ff3b30]">digital systems.</span>
            </h2>

            <p className="lead mt-6 max-w-md">
              W Morgan Technologies is a modern technology partner. We design and engineer
              software products that bring clarity, performance, and long-term business value to
              ambitious companies.
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-3">
              {metrics.map((item, index) => (
                <div
                  key={item.value}
                  className="rounded-2xl border border-[#0e1411]/10 bg-white p-5 shadow-[0_8px_24px_-16px_rgba(8,18,13,0.25)]"
                >
                  <dt className="font-serif text-4xl italic leading-none text-[#176b4d]">
                    {item.value}
                  </dt>
                  <dd className="mt-3 text-xs leading-5 text-[#5c655f]">{item.label}</dd>
                  <span
                    aria-hidden="true"
                    className={`mt-4 block h-0.5 w-8 rounded-full ${
                      index === 0 ? "bg-[#ff3b30]" : "bg-[#2faa7d]"
                    }`}
                  />
                </div>
              ))}
            </dl>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="relative lg:col-span-7"
          >
            <div className="frame frame-ring aspect-[4/3] rounded-[1.5rem] shadow-[0_40px_80px_-40px_rgba(8,18,13,0.55)]">
              <img src={aboutImg} alt="W Morgan Engineering Team" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#08120d]/60 via-transparent to-transparent"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-white/15 bg-[#0d1b14]/65 px-4 py-2.5 backdrop-blur-md">
                <span className="mono-label text-white/80">Product Architecture</span>
                <span className="mono-label text-[#7be0b4]">Tamil Nadu, IN</span>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 -z-10 hidden h-1/2 w-1/2 rounded-[1.5rem] bg-[#e4eee7] lg:block"
            />
          </motion.div>
        </div>

        {/* PRINCIPLES: one connected spec strip */}
        <div className="mt-14 grid overflow-hidden rounded-2xl border border-[#0e1411]/10 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06, ease }}
                className="spot group border-[#0e1411]/10 p-6 transition-colors duration-300 hover:bg-[#f6faf7] max-sm:border-b sm:[&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 sm:odd:border-r lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d1b14] text-[#7be0b4] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon size={17} strokeWidth={1.7} />
                  </span>
                  <span className="chip-num">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-[#0e1411]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-6 text-[#5c655f]">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
