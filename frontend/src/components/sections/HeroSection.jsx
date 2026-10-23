import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import Marquee from "../common/Marquee";
import { paths } from "../../routes/paths";
import slideDigital from "../../assets/hero.png";
import slideEngineering from "../../assets/img4.jpeg";
import slideCloud from "../../assets/img5.jpeg";

const AUTOPLAY_MS = 7000;

// Capabilities ribbon under the hero (names already used on the Services section)
const ribbon = [
  "Custom Software",
  "Web Applications",
  "Mobile Apps",
  "E-Commerce",
  "Business Applications & ERP",
  "Cloud",
  "AI",
];

/*
 * Three slides. Copy sticks to what the company already says about itself (see About, Services
 * and the company introduction); no figures or client claims are made here.
 */
const slides = [
  {
    eyebrow: "Digital Product Engineering",
    title: "Technology That Understands Your Business.",
    accent: "Engineering Solutions. Enabling Growth.",
    text: "We design and engineer digital products, platforms and intelligent solutions that help businesses operate, scale and grow.",
    image: slideDigital,
    alt: "Business analytics dashboard on a laptop",
    primary: { label: "Start a Conversation", href: paths.contact },
    secondary: { label: "View Our Work", href: paths.portfolio },
  },
  {
    eyebrow: "Custom Software",
    title: "Software built around your business.",
    accent: "From first idea to deployed product.",
    text: "We design, build, deploy and maintain web and mobile applications, APIs and business software for growing companies.",
    image: slideEngineering,
    alt: "Developer planning an application on a laptop",
    primary: { label: "Our Services", href: paths.services },
    secondary: { label: "Start a Conversation", href: paths.contact },
  },
  {
    eyebrow: "Cloud & Intelligent Solutions",
    title: "Scalable platforms, ready for growth.",
    accent: "Secure, supported, accountable.",
    text: "Cloud solutions and data-driven applications delivered by one team, from design through long-term support.",
    image: slideCloud,
    alt: "Cloud and data analytics visual",
    primary: { label: "View Our Work", href: paths.portfolio },
    secondary: { label: "Get in Touch", href: paths.contact },
  },
];

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const touchStartX = useRef(null);

  const go = useCallback((index) => setActive((index + slides.length) % slides.length), []);

  // Autoplay: off for reduced-motion users, paused while hovering/focusing the hero, and
  // not running while the tab is hidden.
  useEffect(() => {
    if (reduced || paused) return undefined;
    const timer = setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reduced, paused, active]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) go(active + (delta < 0 ? 1 : -1));
  };

  const fade = "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none";
  const arrowButton =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-[#0d1b14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7be0b4]";

  return (
    <section
      className="surface-dark aurora on-dark relative"
      aria-roledescription="carousel"
      aria-label="Featured services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span aria-hidden="true" className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 pb-12 pt-10 sm:pt-12 lg:min-h-[500px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-14 lg:pt-14">
          {/* TEXT: every slide shares one grid cell, so the hero never changes height */}
          <div>
            <div className="grid">
              {slides.map((slide, index) => {
                const current = index === active;
                // One <h1> per page: the first slide owns it, the others use <h2>.
                const Heading = index === 0 ? "h1" : "h2";
                return (
                  <div
                    key={slide.eyebrow}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slides.length}`}
                    aria-hidden={!current}
                    inert={!current ? "" : undefined}
                    className={`col-start-1 row-start-1 ${fade} ${
                      current ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    <p className="eyebrow eyebrow-light mb-6">{slide.eyebrow}</p>

                    <Heading className="display text-[clamp(1.9rem,3.9vw,3.2rem)] leading-[1.05] tracking-[-0.04em] text-white">
                      <span className="block">{slide.title}</span>{" "}
                      <span className="mt-2 block font-serif font-normal italic tracking-[-0.02em] text-[#7be0b4]">
                        {slide.accent}
                      </span>
                    </Heading>

                    <p className="lead mt-5 max-w-[32rem] !text-[1rem] !leading-7">{slide.text}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button href={slide.primary.href} arrow variant="light">
                        {slide.primary.label}
                      </Button>
                      <Button href={slide.secondary.href} variant="ghost">
                        {slide.secondary.label}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* slide index with timed progress */}
            <div className="mt-8 flex items-center gap-4 sm:gap-5" role="group" aria-label="Choose slide">
              <span className="font-mono text-xs tracking-[0.2em] text-white/50">
                <span className="text-white">{String(active + 1).padStart(2, "0")}</span> /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
                {slides.map((slide, index) => (
                  <button
                    key={slide.eyebrow}
                    type="button"
                    onClick={() => go(index)}
                    aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                    aria-current={index === active ? "true" : undefined}
                    className="group flex h-6 flex-1 items-center"
                  >
                    <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/20 transition-colors group-hover:bg-white/35">
                      {index === active && (
                        <span
                          key={`${active}-${paused}`}
                          className="absolute inset-0 origin-left rounded-full bg-[#7be0b4]"
                          style={
                            reduced
                              ? undefined
                              : {
                                  animation: `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                                  animationPlayState: paused ? "paused" : "running",
                                }
                          }
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => go(active - 1)} aria-label="Previous slide" className={arrowButton}>
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(active + 1)} aria-label="Next slide" className={arrowButton}>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* IMAGES: cross-fade inside a leaf-shaped frame with ring and floating label */}
          <div className="relative mx-auto w-full max-w-[440px] lg:ml-auto">
            <span
              aria-hidden="true"
              className="rings absolute -right-16 -top-16 -z-10 h-72 w-72 sm:-right-24 sm:-top-20"
            />
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[4rem_1rem_4rem_1rem] bg-[radial-gradient(closest-side,rgba(47,170,125,0.3),transparent)] blur-2xl"
            />

            <div className="shape-leaf relative aspect-[4/4.2] overflow-hidden border border-white/15 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.75)]">
              {slides.map((slide, index) => (
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={index === active ? slide.alt : ""}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : undefined}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none ${
                    index === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                />
              ))}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#08120d]/70 via-transparent to-[#08120d]/10"
              />
            </div>

            {/* floating label */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0d1b14]/85 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7be0b4] font-mono text-[11px] font-semibold text-[#0d1b14]">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-white">{slides[active].eyebrow}</span>
                <span className="mono-label block text-white/55">Coimbatore · India</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* capabilities ribbon */}
      <div className="border-t border-white/10 bg-black/20 py-3 backdrop-blur-sm">
        <Marquee speed={55} aria-hidden="true">
          {ribbon.map((item) => (
            <span
              key={item}
              className="flex items-center gap-8 px-4 font-serif text-lg italic text-white/70 sm:text-xl"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-[#7be0b4]" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default HeroSection;
