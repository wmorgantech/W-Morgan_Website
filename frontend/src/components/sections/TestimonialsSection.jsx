import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import { fetchPublicTestimonials } from "../../lib/api";
import { validImageUrl } from "../../lib/portfolioApi";

const ease = [0.22, 1, 0.36, 1];

function initials(name = "") {
  return name
    .replace(/^(mr|mrs|ms|miss|dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function detailLine(t) {
  return [t.role, t.company, t.location].filter(Boolean).join(" · ");
}

function Avatar({ t, large }) {
  const photo = validImageUrl(t.avatarUrl);
  const size = large ? "h-11 w-11 text-xs" : "h-9 w-9 text-[11px]";

  return photo ? (
    <img
      src={photo}
      alt=""
      loading="lazy"
      className={`shrink-0 rounded-full border border-[#7be0b4]/30 object-cover ${size}`}
    />
  ) : (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#7be0b4]/30 bg-[#7be0b4]/10 font-mono font-medium text-[#7be0b4] ${size}`}
      aria-hidden="true"
    >
      {initials(t.authorName)}
    </span>
  );
}

function Author({ t, large = false }) {
  const detail = detailLine(t);

  return (
    <div className="flex items-center gap-3">
      <Avatar t={t} large={large} />
      <div>
        <p className={`font-semibold text-white ${large ? "text-sm" : "text-[13px]"}`}>
          {t.authorName}
        </p>
        {detail && <p className="mt-0.5 text-xs text-white/50">{detail}</p>}
      </div>
    </div>
  );
}

/**
 * Client testimonials, managed entirely in Admin → Testimonials.
 *  - Only published records reach this component (the API filters them).
 *  - The whole section is hidden while loading, on error, and when nothing is
 *    published, so visitors never see an empty box.
 *  - A client with no quote is shown with only the details that were provided
 *    (name, location, ...). A quote is never made up.
 */
function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    fetchPublicTestimonials()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Unexpected testimonials response.");
        if (active) {
          setItems(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status !== "ready") return null;

  // Defensive: published only, one card per record.
  const seen = new Set();
  const published = items.filter((t) => {
    if (t.featured === false || !t.authorName || seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  const withQuote = published.filter((t) => t.quote?.trim()).slice(0, 3);
  const withoutQuote = published.filter((t) => !t.quote?.trim());

  if (!withQuote.length && !withoutQuote.length) return null;

  const [featured, ...rest] = withQuote;

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

        {featured && (
          <div className="grid gap-4 lg:grid-cols-12">
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
                <Author t={featured} large />
              </figcaption>
            </motion.figure>

            {rest.length > 0 && (
              <div className="grid gap-4 lg:col-span-5">
                {rest.map((t, index) => (
                  <motion.figure
                    key={t.id}
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

        {withoutQuote.length > 0 && (
          <ul
            className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${featured ? "mt-4" : ""}`}
            aria-label="Clients"
          >
            {withoutQuote.map((t, index) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06, ease }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <Author t={t} large />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
