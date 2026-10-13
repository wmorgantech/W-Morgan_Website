import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import aboutImg from "../../assets/img2.jpeg";

const ease = [0.22, 1, 0.36, 1];

const metrics = [
  { value: "Custom", label: "Tailored Software Engineering" },
  { value: "Agile", label: "Rapid Product Delivery" },
];

/**
 * "Who we are" summary shown on the Home page.
 * The company values live in one place only (WhyMorganSection on the About
 * page), so they are not repeated here.
 */
export default function AboutSection() {
  return (
    <section className="bg-[#f6f6f1] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-5"
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

            <Link to={paths.about} className="link-arrow mt-8">
              About W Morgan Technologies
              <ArrowUpRight size={14} />
            </Link>
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
              <img src={aboutImg} alt="W Morgan Technologies engineering team at work" />
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
      </div>
    </section>
  );
}
