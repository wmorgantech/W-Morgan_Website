import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { EmptyState, ErrorState, LoadingState } from "../components/common/DataState";
import FinalCTASection from "../components/sections/FinalCTASection";
import ProcessSection from "../components/sections/ProcessSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";

const ease = [0.22, 1, 0.36, 1];

const iconMap = {
  Code2,
  Smartphone,
  BrainCircuit,
  Cloud,
  Palette,
  RefreshCw,
};

export default function Services() {
  usePageMeta({
    title: "Services",
    description:
      "From product ideas to scalable platforms, W Morgan Technologies combines design, engineering and modern technology to build digital systems that create value.",
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
          description: item.description || item.summary,
          icon: iconMap[item.icon] || Code2,
          features: Array.isArray(item.features) ? item.features : [],
        }));
        if (active) {
          setServiceList(mapped);
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
    <div className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* HERO */}
      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="eyebrow eyebrow-light"
              >
                Services Overview
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="display mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1] text-white"
              >
                Technology that
                <br />
                <span className="text-[#ff3b30]">moves business.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease }}
              className="lead max-w-md border-l border-[#7be0b4]/40 pl-5"
            >
              From product ideas to scalable platforms, we combine design, engineering and modern
              tech to build digital systems that create value.
            </motion.p>
          </div>
        </div>
      </section>

      {/* SERVICES: an editorial index, one service per row */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {status === "loading" && <LoadingState label={"Loading services..."} variant="rows" />}
          {status === "error" && <ErrorState message={errorMessage} />}
          {status === "empty" && <EmptyState message={"No services are available right now."} />}
          {status === "ready" && (
            <ul className="border-t border-[#0e1411]/12">
              {serviceList.map((service, index) => {
                const Icon = service.icon || Code2;
                return (
                  <motion.li
                    key={service.id || service.number}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (index % 3) * 0.05, duration: 0.45, ease }}
                    className="spot group relative grid gap-5 border-b border-[#0e1411]/12 px-1 py-7 transition-colors duration-300 hover:bg-[#f6f6f1] md:grid-cols-[5rem_1fr_1fr] md:gap-8 md:px-4 md:py-9 lg:grid-cols-[6rem_1.1fr_1fr_auto]"
                  >
                    {/* number + icon */}
                    <div className="flex items-start gap-4 md:flex-col md:gap-5">
                      <span className="font-serif text-4xl italic leading-none text-[#176b4d]/70 transition-colors group-hover:text-[#176b4d] md:text-5xl">
                        {service.number}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d1b14] text-[#7be0b4] transition-transform duration-500 group-hover:-rotate-6">
                        <Icon size={18} strokeWidth={1.6} />
                      </span>
                    </div>

                    {/* title + description */}
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight md:text-[1.6rem]">
                        {service.title}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[14px] leading-7 text-[#5c655f]">
                        {service.description}
                      </p>
                    </div>

                    {/* capabilities */}
                    <div>
                      {service.features.length > 0 && (
                        <>
                          <p className="mono-label text-[#0e1411]/40">Key Capabilities</p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {service.features.map((feat) => (
                              <li key={feat} className="pill">
                                <Check size={11} className="text-[#2faa7d]" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    {/* action */}
                    <Link
                      to={paths.contact}
                      aria-label={`Discuss ${service.title}`}
                      className="hidden h-11 w-11 items-center justify-center self-center rounded-full border border-[#0e1411]/15 text-[#0e1411] transition-all duration-300 group-hover:border-[#0d1b14] group-hover:bg-[#0d1b14] group-hover:text-white lg:flex"
                    >
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* HOW WE WORK: single shared section */}
      <ProcessSection />

      <FinalCTASection />
    </div>
  );
}
