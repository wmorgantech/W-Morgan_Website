import { motion } from "framer-motion";
import Button from "../common/Button";
import heroVisual from "../../assets/hero.png";

const ease = [0.22, 1, 0.36, 1];

const capabilities = ["Software", "Cloud", "AI", "Data"];

function HeroSection() {
  return (
    <section className="surface-dark on-dark relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 py-14 sm:py-20 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24">
          {/* LEFT */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="eyebrow eyebrow-light mb-6"
            >
              Digital Product Engineering
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease }}
              className="display text-[clamp(2.7rem,5.8vw,4.75rem)] leading-[0.98] tracking-[-0.05em] text-white"
            >
              Building software
              <span className="mt-1 block text-[#176b4d]">that works for business.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease }}
              className="lead mt-6 max-w-[30rem] !text-[1.0625rem] !leading-8"
            >
              We design and engineer digital products, platforms and intelligent solutions that
              help businesses operate, scale and grow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href="/contact" arrow variant="light">
                Start a Conversation
              </Button>

              <Button href="/portfolio" variant="ghost">
                View Our Work
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6"
              aria-label="Capabilities"
            >
              {capabilities.map((item) => (
                <li key={item} className="pill pill-dark !px-3.5 !py-1.5 !text-xs">
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT: framed product visual */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="relative mx-auto w-full max-w-[560px] lg:ml-auto"
          >
            {/* soft emerald halo */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(47,170,125,0.28),transparent)] blur-2xl"
            />

            <div className="frame frame-ring aspect-[5/4] rounded-[1.4rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              <img
                src={heroVisual}
                alt="WMorgan Technologies digital solutions"
                className="h-full w-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#08120d]/55 via-transparent to-transparent"
              />
            </div>

            {/* offset hairline frame */}
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-[1.4rem] border border-[#7be0b4]/25"
            />

            {/* floating label */}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1b14]/70 px-3.5 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7be0b4]" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">
                WMorgan Technologies
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
