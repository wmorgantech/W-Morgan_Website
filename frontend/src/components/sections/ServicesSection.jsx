import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Sparkles,
  CloudCog,
  PenTool,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import { fetchPublicServices } from "../../lib/api";
import { EmptyState, ErrorState, LoadingState } from "../common/DataState";

const ease = [0.22, 1, 0.36, 1];

const iconMap = {
  Code2,
  Smartphone,
  Sparkles,
  CloudCog,
  PenTool,
  Workflow,
};

function ServiceCard({ service, index }) {
  const Icon = service.icon || Code2;
  const isDark = service.theme === "dark";
  const isLarge = service.size === "large";
  const features = Array.isArray(service.features) ? service.features.slice(0, 4) : [];
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease }}
      className={isLarge ? "md:col-span-2 md:row-span-2" : ""}
    >
      <Link
        to={paths.services}
        className={`spot ${isDark ? "spot-dark" : ""} group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
          isLarge ? "min-h-[360px] md:p-8" : "min-h-[200px]"
        } ${
          isDark
            ? "border-[#0d1b14] bg-[#0d1b14] text-white hover:border-[#2faa7d]/60"
            : "border-[#0e1411]/10 bg-white text-[#0e1411] shadow-[0_8px_24px_-16px_rgba(8,18,13,0.25)] hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:shadow-[0_24px_50px_-28px_rgba(8,18,13,0.4)]"
        }`}
      >
        {/* Oversized outlined numeral */}
        {isLarge && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-2 select-none text-[11rem] font-bold leading-none tracking-tighter text-transparent transition-transform duration-700 [-webkit-text-stroke:1px_rgba(123,224,180,0.16)] group-hover:-translate-x-2"
          >
            {number}
          </span>
        )}

        {/* Top row */}
        <div className="relative flex items-center justify-between">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 ${
              isDark
                ? "border-white/15 bg-white/[0.07] text-[#7be0b4]"
                : "border-[#0e1411]/10 bg-[#f6f6f1] text-[#0d1b14] group-hover:border-[#0d1b14] group-hover:bg-[#0d1b14] group-hover:text-[#7be0b4]"
            }`}
          >
            <Icon size={19} strokeWidth={1.6} />
          </span>

          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-[10px] font-medium tracking-[0.2em] ${
                isDark ? "text-white/40" : "text-[#0e1411]/35"
              }`}
            >
              {number}
            </span>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                isDark
                  ? "border-white/15 text-white group-hover:border-[#7be0b4] group-hover:bg-[#7be0b4] group-hover:text-[#0d1b14]"
                  : "border-[#0e1411]/15 text-[#0e1411] group-hover:border-[#0d1b14] group-hover:bg-[#0d1b14] group-hover:text-white"
              }`}
            >
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="relative mt-10">
          <h3
            className={`font-semibold tracking-tight ${
              isLarge ? "text-3xl md:text-[2.1rem]" : "text-lg"
            }`}
          >
            {service.name || service.title}
          </h3>

          <p
            className={`mt-2.5 leading-relaxed ${isLarge ? "max-w-md text-[15px]" : "text-[13px]"} ${
              isDark ? "text-white/62" : "text-[#5c655f]"
            }`}
          >
            {service.summary || service.description}
          </p>

          {isLarge && features.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {features.map((feature) => (
                <li key={feature} className="pill pill-dark">
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </motion.div>
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
        const mapped = data.map((item, idx) => ({
          ...item,
          title: item.name,
          icon: iconMap[item.icon] || Code2,
          theme: idx === 0 || idx === 4 ? "dark" : "light",
          size: idx === 0 && data.length >= 5 ? "large" : "small",
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

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)] text-[#0e1411]">
              Technology that <span className="text-[#ff3b30]">moves business.</span>
            </h2>
          </div>

          <Link to={paths.services} className="link-arrow self-start md:self-auto">
            Explore all services
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {status === "loading" && <LoadingState label={"Loading services..."} variant="bento" />}
        {status === "error" && <ErrorState message={errorMessage} />}
        {status === "empty" && <EmptyState message={"No services are available right now."} />}
        {status === "ready" && (
          <div className="grid auto-rows-[minmax(190px,auto)] gap-4 md:grid-cols-3">
            {items.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id || service.name || index} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesSection;
