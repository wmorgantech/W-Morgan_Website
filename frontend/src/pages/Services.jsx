import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  BrainCircuit,
  Cloud,
  Palette,
  RefreshCw,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicServices } from "../lib/api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/common/DataState";
import PageHero from "../components/common/PageHero";
import FinalCTASection from "../components/sections/FinalCTASection";
import ProcessSection from "../components/sections/ProcessSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";

const iconMap = {
  Code2,
  Smartphone,
  BrainCircuit,
  Cloud,
  Palette,
  RefreshCw,
};

const technologies = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "ASP.NET"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Azure", "DevOps"],
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon || Code2;

  return (
    <article className="group flex h-full flex-col border-t border-[#0e1411]/15 py-5 sm:py-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.16em] text-[#267447]">
          {service.number}
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2eee5] text-[#176b4d] transition-colors duration-300 group-hover:bg-[#176b4d] group-hover:text-white">
          <Icon size={20} strokeWidth={1.7} />
        </span>
      </div>

      <h2 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {service.title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#59615b]">
        {service.description}
      </p>

      {service.features.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#267447]">
            Key capabilities
          </p>

          <ul className="mt-2 flex flex-wrap gap-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#176b4d]/15 bg-white px-2.5 py-1 text-xs text-[#33463b]"
              >
                <Check size={11} className="shrink-0 text-[#267447]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link
          to={paths.contact}
          aria-label={`Discuss ${service.title}`}
          className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#176b4d] transition-colors hover:text-[#0d1b14]"
        >
          Discuss this service
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export default function Services() {
  usePageMeta({
    title: "Services",
    description:
      "Explore W Morgan Technologies services, including web development, custom software, digital product engineering, and business platforms.",
  });

  const [serviceList, setServiceList] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicServices()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The services response was not a list.");
        }

        const mapped = data.map((item, idx) => ({
          ...item,
          id: item.id,
          number: String(idx + 1).padStart(2, "0"),
          title: item.name,
          description: item.description || item.summary || "",
          icon: iconMap[item.icon] || Code2,
          features: Array.isArray(item.features) ? item.features : [],
        }));

        if (active) {
          setServiceList(mapped);
          setStatus(mapped.length > 0 ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "Services could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="overflow-x-clip bg-[#f6f6f1] text-[#0e1411]">
      {/* Hero */}
      <PageHero
        eyebrow="Our Services"
        title="Technology that"
        accent="moves business forward."
        description="We design and build digital solutions that help businesses solve problems, improve workflows, and move confidently toward their goals."
      />

      {/* Core services */}
      <section className="relative bg-[#f6f6f1] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#267447]">
                What We Do
              </p>

              <h2 className="text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                Solutions designed around{" "}
                <span className="font-serif italic text-[#267447]">
                  your needs.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-[#59615b]">
              From the first idea to a working digital product, we focus on
              practical technology and meaningful outcomes.
            </p>
          </div>

          {status === "loading" && (
            <LoadingState label="Loading services..." variant="rows" />
          )}

          {status === "error" && (
            <ErrorState message={errorMessage} />
          )}

          {status === "empty" && (
            <EmptyState message="No services are available right now." />
          )}

          {status === "ready" && (
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
              {serviceList.map((service, index) => (
                <ServiceCard
                  key={service.id || service.number}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Technologies */}
      <section className="border-y border-white/10 bg-[#0d1b14] py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7be0b4]">
                Our Technology Stack
              </p>

              <h2 className="text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
                The right tools for{" "}
                <span className="font-serif italic text-[#7be0b4]">
                  the right solution.
                </span>
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                We choose technologies according to each project's
                requirements, performance needs, and long-term goals.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
              {technologies.map((group) => (
                <div
                  key={group.category}
                  className="border-t border-white/15 pt-3"
                >
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    {group.category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Existing process section */}
      <ProcessSection />

      {/* Existing CTA */}
      <FinalCTASection
        heading="The Right Technology."
        accent="The Right Solution."
        description="Let's find the right digital solutions to move your business forward."
        primaryLabel="Discuss Your Project"
        primaryHref="/contact"
        secondaryLabel="View Our Work"
        secondaryHref="/portfolio"
      />
    </main>
  );
}