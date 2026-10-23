import { Brain, Cloud, Database, LayoutTemplate, Server } from "lucide-react";
import Reveal from "../common/Reveal";

const technologyGroups = [
  { title: "Frontend", icon: LayoutTemplate, technologies: ["React", "Next.js", "JavaScript"] },
  { title: "Backend", icon: Server, technologies: ["Node.js", "NestJS", "Express.js", "ASP.NET"] },
  { title: "Cloud & DevOps", icon: Cloud, technologies: ["AWS", "Azure", "DevOps"] },
  { title: "Database & Data", icon: Database, technologies: ["PostgreSQL", "MongoDB"] },
  { title: "AI", icon: Brain, technologies: ["Claude", "Generative AI"] },
];

/** The stack as five compact cards, each holding its technologies as tags. */
function TechnologySection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Technology</p>
            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
              Our engineering <span className="text-[#176b4d]">stack.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5c655f]">
            Proven technologies for scalable, reliable and maintainable products.
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {technologyGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <Reveal
                as="li"
                key={group.title}
                y={14}
                delay={index * 0.05}
                className="group rounded-2xl border border-[#0e1411]/10 bg-[#f6f6f1] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:bg-white hover:shadow-[0_18px_36px_-24px_rgba(8,18,13,0.45)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d1b14] text-[#7be0b4] transition-transform duration-300 group-hover:-rotate-6">
                  <Icon size={17} strokeWidth={1.6} />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-[#0e1411]">
                  {group.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.technologies.map((technology) => (
                    <li key={technology} className="pill !px-2.5 !py-1 !text-[11.5px]">
                      {technology}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TechnologySection;
