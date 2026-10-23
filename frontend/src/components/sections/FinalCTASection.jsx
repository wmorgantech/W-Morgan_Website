import Button from "../common/Button";
import Reveal from "../common/Reveal";
import { paths } from "../../routes/paths";

/** A short closing strip: one heading, one line, two compact buttons. */
function FinalCTASection({
  heading = "Have an Idea?",
  accent = "Let's Build It.",
  description = "Ready to turn your vision into a digital product? Let's make it happen.",
  primaryLabel = "Start a Conversation",
  primaryHref = paths.contact,
  secondaryLabel = "Explore Our Work",
  secondaryHref = paths.portfolio,
}) {
  return (
    <section className="surface-dark aurora on-dark relative z-10 -mt-6 rounded-t-[2rem] bg-[#0a1610] py-10 md:py-12">
      <span aria-hidden="true" className="grain-overlay" />
      <Reveal
        y={14}
        className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12"
      >
        <div className="max-w-xl">
          <h2 className="display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight tracking-[-0.03em] text-white">
            {heading} <span className="text-[#ff3b30]">{accent}</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            href={primaryHref}
            arrow
            variant="light"
            className="!min-h-10 !pl-5 !text-[13px] [&_.btn-arrow]:!h-7 [&_.btn-arrow]:!w-7"
          >
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="ghost" className="!min-h-10 !text-[13px]">
            {secondaryLabel}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

export default FinalCTASection;
