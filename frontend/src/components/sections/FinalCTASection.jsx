import { motion } from "framer-motion";
import Button from "../common/Button";
import { paths } from "../../routes/paths";
import ctaImg from "../../assets/img11.jpeg";

function FinalCTASection() {
  return (
    <section className="bg-[#f6f6f1] px-5 py-14 sm:px-8 md:py-20 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="surface-dark on-dark relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_50px_100px_-50px_rgba(8,18,13,0.8)]"
      >
        {/* image fades in from the right edge */}
        <img
          src={ctaImg}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-45 [mask-image:linear-gradient(to_right,transparent_25%,black_85%)] md:w-3/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0d1b14] via-[#0d1b14]/85 to-transparent"
        />

        <div className="relative grid gap-8 px-7 py-14 md:px-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h2 className="display text-[clamp(2.1rem,4.4vw,3.5rem)] text-white">
              Let's build <span className="text-[#ff3b30]">something</span> meaningful.
            </h2>

            <p className="lead mt-5 max-w-md">
              Have an idea or a product that needs to evolve? Let's talk.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch xl:flex-row xl:justify-end">
            <Button href={paths.contact} arrow variant="light">
              Start a Conversation
            </Button>
            <Button href={paths.portfolio} variant="ghost">
              Explore Our Work
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default FinalCTASection;
