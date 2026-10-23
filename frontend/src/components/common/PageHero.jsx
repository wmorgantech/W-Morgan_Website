import Reveal from "./Reveal";

/**
 * Shared hero for the inner pages: a deep-green aurora surface with the ring motif.
 * Content below it should start with `sheet-top` so the page flows over the hero's edge.
 */
export default function PageHero({ eyebrow, title, accent, description, children }) {
  return (
    <section className="surface-dark aurora on-dark relative">
      <span aria-hidden="true" className="grain-overlay" />
      <span
        aria-hidden="true"
        className="rings absolute -right-24 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 lg:block"
      />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <Reveal as="p" y={10} className="eyebrow eyebrow-light">
              {eyebrow}
            </Reveal>
            <Reveal
              as="h1"
              delay={0.06}
              className="display mt-5 text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.04] tracking-[-0.035em] text-white"
            >
              {title}
              {accent && (
                <>
                  {" "}
                  <span className="text-[#ff3b30]">{accent}</span>
                </>
              )}
            </Reveal>
          </div>

          {(description || children) && (
            <Reveal delay={0.14} className="lg:pb-2">
              {description && <p className="lead max-w-md">{description}</p>}
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
