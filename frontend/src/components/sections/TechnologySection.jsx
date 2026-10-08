import { motion } from "framer-motion";
import Button from "../common/Button";
import SectionTitle from "../common/SectionTitle";
import { paths } from "../../routes/paths";
import stackImg from "../../assets/img12.jpeg";

const ease = [0.22, 1, 0.36, 1];

const technologyGroups = [
  {
    number: "01",
    title: "Frontend Development",
    description: "Modern interfaces built for performance and usability.",
    technologies: ["React", "Next.js", "JavaScript"],
  },
  {
    number: "02",
    title: "Backend Development",
    description: "Reliable APIs and scalable application architecture.",
    technologies: ["Node.js", "NestJS", "Express.js"],
  },
  {
    number: "03",
    title: "Cloud & DevOps",
    description: "Cloud infrastructure and deployment practices for scale.",
    technologies: ["AWS", "Azure", "DevOps"],
  },
  {
    number: "04",
    title: "Database & Data",
    description: "Structured, secure and production-ready data systems.",
    technologies: ["PostgreSQL", "MongoDB"],
  },
  {
    number: "05",
    title: "AI & Modern Development",
    description: "AI-assisted engineering for faster and smarter delivery.",
    technologies: ["Claude", "Generative AI"],
  },
];

function TechnologySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: sticky intro + platform visual */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionTitle
                eyebrow="Technology"
                title={
                  <>
                    Our engineering <span className="text-[#176b4d]">stack.</span>
                  </>
                }
                description="We use proven technologies to build scalable, reliable and maintainable digital products."
              />

              <div className="mt-7">
                <Button href={paths.products} arrow>
                  Explore Products
                </Button>
              </div>

              <div className="frame frame-ring mt-9 hidden aspect-[16/10] rounded-2xl lg:block">
                <img src={stackImg} alt="" loading="lazy" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08120d]/70 via-transparent to-transparent"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
                  <span className="mono-label text-white/80">Performance · Scale · Reliability</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: stack groups */}
          <div className="lg:col-span-7">
            <ul className="space-y-3">
              {technologyGroups.map((group, index) => (
                <motion.li
                  key={group.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease }}
                  className="spot group grid gap-4 rounded-2xl border border-[#0e1411]/10 bg-[#f6f6f1] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:bg-white hover:shadow-[0_20px_44px_-28px_rgba(8,18,13,0.45)] sm:grid-cols-[3rem_1fr] sm:p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d1b14] font-mono text-[11px] text-[#7be0b4] transition-transform duration-500 group-hover:-rotate-6">
                    {group.number}
                  </span>

                  <div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h3 className="text-[16px] font-semibold tracking-tight text-[#0e1411]">
                        {group.title}
                      </h3>
                      <p className="text-[13px] leading-6 text-[#5c655f] sm:max-w-[16rem] sm:text-right">
                        {group.description}
                      </p>
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {group.technologies.map((technology) => (
                        <li key={technology} className="pill !text-[12px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2faa7d]" />
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </ul>

            <p className="mt-5 text-xs text-[#5c655f]">
              Technology selected around the product, not the other way around.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechnologySection;
