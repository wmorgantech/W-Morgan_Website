import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import { fetchPublicTestimonials } from "../../lib/api";
import { EmptyState, ErrorState, LoadingState } from "../common/DataState";

const ease = [0.22, 1, 0.36, 1];

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Author({ t, size = "md" }) {
  const name = t.authorName || t.name;
  const detail = t.role || t.company;

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border border-[#7be0b4]/30 bg-[#7be0b4]/10 font-mono font-medium text-[#7be0b4] ${
          size === "lg" ? "h-11 w-11 text-xs" : "h-9 w-9 text-[11px]"
        }`}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      <div>
        <p className={`font-semibold text-white ${size === "lg" ? "text-sm" : "text-[13px]"}`}>
          {name}
        </p>
        {detail && <p className="mt-0.5 text-xs text-white/50">{detail}</p>}
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicTestimonials()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The testimonials response was not a list.");
        }
        if (active) {
          setItems(data);
          setStatus(data.length ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "Testimonials could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const [featured, ...rest] = items.slice(0, 3);

  return (
    <section className="surface-dark on-dark py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionTitle
          light
          eyebrow="Client Perspective"
          title={
            <>
              Built to create <span className="text-[#ff3b30]">real impact.</span>
            </>
          }
          className="mb-10 md:mb-12"
        />

        {status === "loading" && (
          <LoadingState label={"Loading testimonials..."} variant="quotes" dark />
        )}
        {status === "error" && <ErrorState message={errorMessage} dark />}
        {status === "empty" && (
          <EmptyState message={"No testimonials are available right now."} dark />
        )}

        {status === "ready" && featured && (
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Featured quote */}
            <motion.figure
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease }}
              className={`spot spot-dark relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 md:p-10 ${
                rest.length ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <Quote
                size={44}
                strokeWidth={1}
                aria-hidden="true"
                className="absolute right-6 top-6 text-[#7be0b4]/25"
              />

              <blockquote className="relative max-w-2xl font-serif text-[1.65rem] italic leading-[1.3] text-white md:text-[2.1rem]">
                “{featured.quote}”
              </blockquote>

              <figcaption className="mt-10 border-t border-white/10 pt-6">
                <Author t={featured} size="lg" />
              </figcaption>
            </motion.figure>

            {/* Supporting quotes */}
            {rest.length > 0 && (
              <div className="grid gap-4 lg:col-span-5">
                {rest.map((t, index) => (
                  <motion.figure
                    key={t.id || t.authorName}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.08 + index * 0.08, ease }}
                    className="spot spot-dark flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20"
                  >
                    <blockquote className="text-[15px] leading-7 text-white/80">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-5 border-t border-white/10 pt-4">
                      <Author t={t} />
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
