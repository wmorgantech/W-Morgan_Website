import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "../common/Reveal";

const metrics = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 100, suffix: "+", label: "Projects Done" },
  { value: 10, suffix: "+", label: "Total Products" },
  { value: 1200, label: "Trusted Clients" },
];

const DURATION_MS = 1600;

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts up to `value` once it scrolls into view. The final value is what is rendered by default
 * (so reduced-motion visitors, tests and no-script views always see the real number); the
 * counter only resets to zero shortly before the block reaches the screen.
 */
function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const nearScreen = useInView(ref, { once: true, margin: "0px 0px 300px 0px" });
  const onScreen = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  // Just before it is visible: park at zero (unless the visitor prefers reduced motion)
  useEffect(() => {
    if (nearScreen && !prefersReducedMotion()) {
      setDisplay(0);
      setArmed(true);
    }
  }, [nearScreen]);

  // Once it is properly on screen: count up with an ease-out curve
  useEffect(() => {
    if (!armed || !onScreen) return undefined;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [armed, onScreen, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** A light band of four figures that count up as it scrolls into view. */
export default function ImpactMetricsSection() {
  return (
    <section className="bg-[#f6f6f1] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-0">
          {metrics.map((metric, index) => (
            <Reveal
              key={metric.label}
              y={14}
              delay={index * 0.06}
              className="md:px-8 md:first:pl-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-[#0e1411]/12"
            >
              <dd className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] italic leading-none tracking-tight">
                <span className="bg-gradient-to-br from-[#0d1b14] to-[#2faa7d] bg-clip-text text-transparent">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </span>
              </dd>
              <dt className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#5c655f]">
                <span className="h-px w-5 bg-[#2faa7d]" aria-hidden="true" />
                {metric.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
