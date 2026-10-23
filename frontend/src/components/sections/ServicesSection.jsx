import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Sparkles,
  CloudCog,
  PenTool,
  Workflow,
  ShoppingBag,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import { fetchPublicServices } from "../../lib/api";
import { ErrorState, LoadingState } from "../common/DataState";
import Reveal from "../common/Reveal";

const iconMap = {
  Code2,
  Smartphone,
  Sparkles,
  CloudCog,
  PenTool,
  Workflow,
};

// Shown only while no services have been published in Admin yet.
const coreServices = [
  {
    name: "Custom Software Development",
    summary: "Purpose-built business software, designed around your processes and growth goals.",
    icon: Code2,
  },
  {
    name: "Web Application Development",
    summary: "Secure, scalable web applications that make everyday work simpler.",
    icon: Workflow,
  },
  {
    name: "Mobile App Development",
    summary: "Useful mobile experiences for customers, teams, and business operations.",
    icon: Smartphone,
  },
  {
    name: "E-Commerce Development",
    summary: "Online stores and commerce systems built to support the way you sell.",
    icon: ShoppingBag,
  },
  {
    name: "Business Applications & ERP",
    summary: "Connected tools for finance, operations, inventory, and reporting.",
    icon: BriefcaseBusiness,
  },
  {
    name: "API & System Integration",
    summary: "Reliable integrations that help your software and services work together.",
    icon: Workflow,
  },
];

/** One service as a wide row: numeral, name, summary, and an arrow that fills on hover. */
function ServiceRow({ service, index }) {
  const Icon = service.icon || Code2;
  const features = Array.isArray(service.features) ? service.features.slice(0, 4) : [];
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={Math.min(index, 4) * 0.05} as="li">
      <Link
        to={paths.services}
        aria-label={`${service.name || service.title}: learn more about our services`}
        className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-t border-white/10 py-4 transition-colors duration-500 hover:bg-white/[0.04] sm:gap-x-6 sm:py-5 sm:pr-3"
      >
        <span
          aria-hidden="true"
          className="outline-num font-serif text-4xl italic leading-none [--num:rgba(123,224,180,0.55)] group-hover:[--num:#7be0b4] sm:text-5xl"
        >
          {number}
        </span>

        <span className="min-w-0 transition-transform duration-500 group-hover:translate-x-2">
          <span className="flex items-center gap-3">
            <Icon size={18} strokeWidth={1.6} className="shrink-0 text-[#7be0b4]" aria-hidden="true" />
            <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {service.name || service.title}
            </span>
          </span>
          {service.summary && (
            <span className="mt-1.5 block max-w-xl text-[13px] leading-5 text-white/55 sm:text-sm">
              {service.summary}
            </span>
          )}
          {features.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-1.5 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:max-h-16 sm:group-hover:opacity-100">
              {features.map((feature) => (
                <span key={feature} className="pill pill-dark !text-[11px]">
                  {feature}
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-[#7be0b4] group-hover:bg-[#7be0b4] group-hover:text-[#0d1b14] sm:h-10 sm:w-10">
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

function ServicesSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicServices()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The services response was not a list.");
        }
        const mapped = data.map((item) => ({
          ...item,
          title: item.name,
          icon: iconMap[item.icon] || Code2,
        }));
        if (active) {
          setItems(mapped);
          setStatus(mapped.length ? "ready" : "empty");
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

  const rows = status === "ready" ? items.slice(0, 6) : status === "empty" ? coreServices : [];

  return (
    <section className="surface-dark on-dark relative z-10 -mt-6 rounded-t-[2rem] bg-[#0a1610] py-12 md:py-16">
      <span aria-hidden="true" className="grain-overlay" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* sticky heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow eyebrow-light">What We Do</p>
              <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-white">
                We build software that <span className="text-[#ff3b30]">moves business.</span>
              </h2>
              <p className="lead mt-4 max-w-md !text-[0.95rem]">
                From discovery and design to development, deployment, and ongoing support, one
                accountable team takes your idea all the way to a working product.
              </p>
              <Link to={paths.services} className="btn btn-light mt-6 !min-h-10 !pl-5 !text-[13px]">
                Explore all services
                <span className="btn-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </Reveal>
          </div>

          {/* index list */}
          <div>
            {status === "loading" && <LoadingState dark label="Loading services..." variant="rows" />}
            {status === "error" && <ErrorState dark message={errorMessage} />}
            {rows.length > 0 && (
              <ul className="border-b border-white/10">
                {rows.map((service, index) => (
                  <ServiceRow key={service.id || service.name || index} service={service} index={index} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
