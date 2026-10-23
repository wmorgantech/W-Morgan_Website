import Reveal from "../common/Reveal";

const reasons = [
  {
    title: "Business First",
    description: "Every decision starts with the outcome we want to create.",
  },
  {
    title: "Built to Scale",
    description: "Systems that evolve with your users, data and operations.",
  },
  {
    title: "Modern Engineering",
    description: "Secure, maintainable and high-performance products.",
  },
  {
    title: "Long-Term Partnership",
    description: "We stay involved after launch to improve and support.",
  },
];

/** The four company values as tall columns that flood with forest green on hover. */
function WhyMorganSection() {
  return (
    <section className="relative bg-[#f6f6f1] pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Why W Morgan</p>
          <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
            We build for <span className="text-[#ff3b30]">the long run.</span>
          </h2>
        </Reveal>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <Reveal
              as="li"
              key={reason.title}
              delay={index * 0.08}
              className="group relative flex min-h-[12.5rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#0e1411]/10 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#0d1b14] hover:bg-[#0d1b14] hover:shadow-[0_40px_70px_-36px_rgba(8,18,13,0.7)]"
            >
              <span
                aria-hidden="true"
                className="outline-num font-serif text-[4rem] italic leading-none [--num:rgba(23,107,77,0.45)] group-hover:[--num:#7be0b4]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-[#0e1411] transition-colors duration-500 group-hover:text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c655f] transition-colors duration-500 group-hover:text-white/65">
                  {reason.description}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-0.5 w-8 rounded-full bg-[#2faa7d] transition-all duration-500 group-hover:w-16 group-hover:bg-[#7be0b4]"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WhyMorganSection;
