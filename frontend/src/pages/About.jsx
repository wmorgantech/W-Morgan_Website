import PageHero from "../components/common/PageHero";
import Reveal from "../components/common/Reveal";
import WhyMorganSection from "../components/sections/WhyMorganSection";
import FinalCTASection from "../components/sections/FinalCTASection";
import { usePageMeta } from "../hooks/usePageMeta";
import heroImg from "../assets/img5.jpeg";
import aboutImg from "../assets/img4.jpeg";

const capabilities = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Modern, responsive websites and web applications built around business needs.",
  },
  {
    number: "02",
    title: "Mobile Applications",
    description:
      "User-focused mobile experiences designed for everyday workflows.",
  },
  {
    number: "03",
    title: "Custom Software",
    description:
      "Purpose-built software to simplify processes and solve business challenges.",
  },
  {
    number: "04",
    title: "UI/UX Design",
    description:
      "Intuitive digital experiences focused on usability and consistency.",
  },
  {
    number: "05",
    title: "E-commerce",
    description:
      "Online shopping experiences designed around products and customers.",
  },
  {
    number: "06",
    title: "Business Platforms",
    description:
      "Digital systems that help teams manage information and workflows.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description: "Understand your goals.",
  },
  {
    number: "02",
    title: "Design",
    description: "Plan the experience.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Build and test.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "Deliver the solution.",
  },
  {
    number: "05",
    title: "Grow",
    description: "Improve over time.",
  },
];

export default function About() {
  usePageMeta({
    title: "About Us",
    description:
      "Discover W Morgan Technologies and our approach to building modern websites, software, and digital solutions for businesses.",
  });

  return (
    <main className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* Hero */}
      <PageHero
        eyebrow="About Us"
        title="Building digital"
        accent="experiences that matter."
        description="We turn business challenges into practical digital solutions through thoughtful design, modern engineering, and a focus on real-world needs."
      />

      {/* Who We Are — no separate large image section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-12 lg:px-12">
          <Reveal>
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#267447]">
                Who We Are
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Technology built around{" "}
                <span className="font-serif italic text-[#267447]">
                  real needs.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#59615b] sm:text-base">
                W Morgan Technologies develops digital experiences and
                software solutions for businesses. We bring design,
                development, and problem-solving together to create useful
                and reliable digital products.
              </p>

              <p className="mt-3 text-sm leading-7 text-[#59615b] sm:text-base">
                Every project starts with understanding the challenge and
                finding a practical way to solve it through technology.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative mx-auto w-full max-w-md md:ml-auto">
              <div className="absolute -bottom-2 -right-2 h-2/3 w-2/3 rounded-xl bg-[#dce9dc]" />
              <img
                src={aboutImg}
                alt="Digital technology and software development"
                loading="lazy"
                className="relative aspect-[5/4] w-full rounded-xl object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Do */}
      <section className="border-y border-[#0e1411]/10 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#267447]">
                What We Do
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Digital solutions for{" "}
                <span className="font-serif italic text-[#267447]">
                  business growth.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#59615b] sm:text-base">
                We build digital products and platforms around real business
                requirements.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {capabilities.map((item) => (
              <Reveal key={item.number}>
                <article className="group border-t border-[#0e1411]/15 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium tracking-widest text-[#267447]">
                      {item.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-lg text-[#267447] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#59615b]">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Why Morgan section */}
      <WhyMorganSection />

      {/* Our Process */}
      <section className="bg-[#e9eee6] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-9 max-w-2xl sm:mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#267447]">
                Our Process
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                From idea to{" "}
                <span className="font-serif italic text-[#267447]">
                  impact.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-5 lg:gap-5">
            {/* Vertical line on mobile */}
            <div
              aria-hidden="true"
              className="absolute bottom-4 left-[11px] top-3 w-px bg-[#267447]/30 sm:hidden"
            />

            {/* Horizontal line on desktop */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-3 hidden h-px bg-[#267447]/30 lg:block"
            />

            {process.map((item) => (
              <Reveal key={item.number}>
                <div className="relative pl-9 lg:pl-0 lg:pt-8">
                  <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#267447] bg-[#e9eee6] lg:top-0">
                    <span className="h-2 w-2 rounded-full bg-[#267447]" />
                  </span>

                  <p className="text-xs font-semibold tracking-[0.15em] text-[#267447]">
                    {item.number}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#59615b]">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Existing CTA */}
      <FinalCTASection />
    </main>
  );
}