import { motion } from "framer-motion";
import Button from "../common/Button";
import SectionTitle from "../common/SectionTitle";
import { paths } from "../../routes/paths";
import teamImg from "../../assets/img4.jpeg";

const ease = [0.22, 1, 0.36, 1];

const disciplines = [
  "Product & Strategy",
  "UI/UX Design",
  "Software Engineering",
  "Cloud & DevOps",
  "AI & Data",
];

function TeamSection() {
  const [lead, ...others] = disciplines;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="lg:col-span-5">
          <SectionTitle
            eyebrow="Our People"
            title={
              <>
                Great people{" "}
                <span className="text-[#ff3b30]">build great products.</span>
              </>
            }
            description="Product thinkers, designers and engineers who care about solving meaningful problems."
          />

          <div className="mt-7">
            <Button href={paths.career} arrow>
              Meet the team
            </Button>
          </div>
        </div>

        {/* Discipline bento */}
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease }}
            className="frame frame-ring group relative min-h-[220px] rounded-2xl sm:col-span-2"
          >
            <img src={teamImg} alt="" loading="lazy" className="absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#08120d]/85 via-[#08120d]/25 to-transparent"
            />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
              <div>
                <p className="mono-label text-[#7be0b4]">01</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{lead}</p>
              </div>
            </div>
          </motion.div>

          {others.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 + index * 0.05, ease }}
              className="spot group flex items-center justify-between rounded-2xl border border-[#0e1411]/10 bg-[#f6f6f1] px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:bg-white hover:shadow-[0_18px_40px_-28px_rgba(8,18,13,0.5)]"
            >
              <div>
                <p className="chip-num">{String(index + 2).padStart(2, "0")}</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight text-[#0e1411]">
                  {name}
                </p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#2faa7d] transition-transform duration-300 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
