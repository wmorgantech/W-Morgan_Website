import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import { usePageMeta } from "../../hooks/usePageMeta";

/**
 * Shared layout for the Privacy Policy and Terms pages.
 * `sections` is an array of { id, heading, body } where body is a React node.
 */
export default function LegalPage({
  title,
  metaDescription,
  intro,
  lastUpdated,
  sections,
  otherPage,
}) {
  usePageMeta({ title, description: metaDescription });

  return (
    <main className="bg-[#f6f6f1] text-[#0e1411]">
      <section className="surface-dark aurora on-dark relative">
        <span aria-hidden="true" className="grain-overlay" />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 md:pb-20 md:pt-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow eyebrow-light">Legal</p>
            <h1 className="display mt-4 text-[clamp(2rem,4vw,3rem)] tracking-[-0.035em] text-white">{title}</h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
              Last updated: {lastUpdated}
            </p>
            {intro && <p className="lead mt-5 max-w-2xl">{intro}</p>}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 rounded-t-[2rem] bg-[#f6f6f1] pb-4 pt-2">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {/* On this page */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="mono-label text-[#0e1411]/45">On this page</p>
              <ol className="mt-4 space-y-2.5 border-l border-[#0e1411]/10 pl-4 text-[13px]">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-[#4b554f] transition-colors hover:text-[#176b4d]"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-3xl">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-[#0e1411]/10 py-8 first:border-t-0 first:pt-0"
              >
                <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight">
                  <span className="font-mono text-xs font-medium text-[#176b4d]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#3d4741] [&_a]:font-medium [&_a]:text-[#176b4d] [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}

            {otherPage && (
              <p className="mt-6 border-t border-[#0e1411]/10 pt-6 text-sm text-[#5c655f]">
                See also our{" "}
                <Link
                  to={otherPage.path}
                  className="font-medium text-[#176b4d] underline underline-offset-2"
                >
                  {otherPage.label}
                </Link>
                .
              </p>
            )}

            <p className="mt-4 text-sm text-[#5c655f]">
              Questions about this page? <Link to={paths.contact} className="font-medium text-[#176b4d] underline underline-offset-2">Contact us</Link>.
            </p>
          </article>
        </div>
        </div>
      </section>
    </main>
  );
}
