import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicTestimonials } from "../../lib/api";
import { validImageUrl } from "../../lib/portfolioApi";
import { paths } from "../../routes/paths";

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

function detailLine(testimonial) {
  return [
    testimonial.role,
    testimonial.company,
    testimonial.location,
  ].filter(Boolean).join(" · ");
}

function Author({ testimonial, dark = false }) {
  const photo = validImageUrl(testimonial.avatarUrl);

  return (
    <div className="flex items-center gap-3">
      {photo ? (
        <img
          src={photo}
          alt=""
          loading="lazy"
          className={`h-12 w-12 shrink-0 rounded-full border object-cover ${dark ? "border-white/20" : "border-[#176b4d]/15"}`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold ${dark ? "bg-[#7be0b4] text-[#0d1b14]" : "bg-[#e6f0ea] text-[#176b4d]"}`}
        >
          {initials(testimonial.authorName)}
        </span>
      )}
      <span>
        <span className={`block text-sm font-semibold ${dark ? "text-white" : "text-[#0e1411]"}`}>
          {testimonial.authorName}
        </span>
        {detailLine(testimonial) && (
          <span className={`mt-0.5 block text-xs ${dark ? "text-white/60" : "text-[#5c655f]"}`}>
            {detailLine(testimonial)}
          </span>
        )}
      </span>
    </div>
  );
}

function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;

    fetchPublicTestimonials()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected testimonials response.");
        }
        if (active) {
          const seen = new Set();
          const published = data.filter((item) => {
            const key = item.id ?? `${item.authorName}-${item.quote}`;
            if (item.featured === false || !item.authorName || seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
          setItems(published);
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

  const quotes = items.filter((item) => item.quote?.trim());
  const clientsWithoutQuote = items.filter((item) => !item.quote?.trim());
  const current = quotes[activeIndex];

  useEffect(() => {
    if (quotes.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % quotes.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [quotes.length]);

  const move = (offset) => {
    setActiveIndex((index) => (index + offset + quotes.length) % quotes.length);
  };

  if (status === "loading") return null;

  return (
    <section className="bg-[#f6f6f1] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <p className="eyebrow">Client Testimonials</p>
            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
              What our partners <span className="text-[#176b4d]">say.</span>
            </h2>
          </div>
          {quotes.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e1411]/15 bg-white text-[#176b4d] transition hover:border-[#176b4d] hover:bg-[#176b4d] hover:text-white"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e1411]/15 bg-white text-[#176b4d] transition hover:border-[#176b4d] hover:bg-[#176b4d] hover:text-white"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>

        {current ? (
          <div className="grid gap-4 lg:grid-cols-12">
            <motion.figure
              key={current.id ?? activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className="surface-dark aurora on-dark relative flex min-h-[240px] flex-col justify-between rounded-[1.5rem] p-6 shadow-[0_30px_60px_-36px_rgba(8,18,13,0.7)] sm:p-8 lg:col-span-9"
            >
              <Quote
                size={96}
                strokeWidth={0.75}
                aria-hidden="true"
                className="absolute right-8 top-8 text-[#7be0b4]/25"
              />
              <blockquote className="relative max-w-4xl pr-6 font-serif text-xl italic leading-[1.4] text-white sm:text-[1.6rem] sm:pr-12">
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/15 pt-4">
                <Author testimonial={current} dark />
              </figcaption>
            </motion.figure>

            <aside className="flex flex-col justify-between rounded-[1.5rem] border border-[#0e1411]/10 bg-white p-5 text-[#0e1411] sm:p-6 lg:col-span-3">
              <p className="mono-label text-[#176b4d]">Trusted partnership</p>
              <p className="mt-6 font-serif text-2xl leading-snug text-[#0d1b14]">
                Real feedback from the people we build with.
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-[#0e1411]/10 pt-5">
                <span className="font-mono text-sm text-[#5c655f]">
                  {activeIndex + 1} / {quotes.length}
                </span>
                <div className="flex gap-1.5" aria-label="Choose a testimonial">
                  {quotes.map((testimonial, index) => (
                    <button
                      key={testimonial.id ?? index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === activeIndex ? "bg-[#176b4d]" : "bg-[#0e1411]/20 hover:bg-[#0e1411]/45"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : clientsWithoutQuote.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Published client stories">
            {clientsWithoutQuote.map((testimonial) => (
              <li
                key={testimonial.id ?? testimonial.authorName}
                className="rounded-2xl border border-[#0e1411]/10 bg-white p-5 shadow-[0_10px_30px_-24px_rgba(8,18,13,0.35)]"
              >
                <Author testimonial={testimonial} />
              </li>
            ))}
          </ul>
        ) : status === "error" ? (
          <p className="rounded-2xl border border-[#0e1411]/10 bg-white p-6 text-sm text-[#5c655f]">
            Client testimonials are temporarily unavailable.
          </p>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#0e1411]/15 bg-white p-7 sm:p-9">
            <p className="max-w-2xl text-sm leading-7 text-[#5c655f]">
              Client stories will appear here once they are published. In the meantime, explore
              some of the solutions we’ve delivered.
            </p>
            <Link to={paths.portfolio} className="link-arrow mt-5">
              View our portfolio
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
