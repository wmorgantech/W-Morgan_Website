import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicTeam } from "../lib/api";
import { TEAM_GROUPS, normalizeMember } from "../lib/team";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";
import { EmptyState, ErrorState, LoadingState } from "../components/common/DataState";
import MemberPhoto from "../components/team/MemberPhoto";
import FinalCTASection from "../components/sections/FinalCTASection";

const ease = [0.22, 1, 0.36, 1];

function MemberCard({ member, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease }}
    >
      <Link
        to={paths.teamProfile(member.id)}
        aria-label={`View profile: ${member.name}`}
        className="spot group block overflow-hidden rounded-2xl border border-[#0e1411]/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:shadow-[0_24px_50px_-30px_rgba(8,18,13,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b4d]"
      >
        <MemberPhoto member={member} className="aspect-[4/5] w-full" textClassName="text-6xl" />

        <div className="flex items-start justify-between gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#0e1411] transition-colors group-hover:text-[#176b4d]">
              {member.name}
            </h3>
            <p className="mt-1 text-[13px] text-[#176b4d]">{member.designation}</p>
            {(member.department || member.location) && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5c655f]">
                {member.location && <MapPin size={12} aria-hidden="true" className="shrink-0" />}
                <span className="truncate">
                  {[member.department, member.location].filter(Boolean).join(" · ")}
                </span>
              </p>
            )}
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0d1b14] text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#176b4d]">
            <ArrowUpRight size={14} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function Team() {
  usePageMeta({
    title: "Our Team",
    description:
      "Meet the people at W Morgan Technologies: our leadership, engineers and interns.",
  });

  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicTeam()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("The team response was not a list.");
        const seen = new Set();
        const mapped = data
          .map(normalizeMember)
          .filter((member) => !seen.has(member.id) && seen.add(member.id));
        if (active) {
          setMembers(mapped);
          setStatus(mapped.length ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "The team could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Known groups first, in a fixed order; anything else falls under "Team".
  const known = new Set(TEAM_GROUPS.map((group) => group.type));
  const sections = TEAM_GROUPS.map((group) => ({
    ...group,
    members: members.filter((member) =>
      group.type === "EMPLOYEE"
        ? member.memberType === "EMPLOYEE" || !known.has(member.memberType)
        : member.memberType === group.type,
    ),
  })).filter((group) => group.members.length);

  return (
    <main className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <p className="eyebrow eyebrow-light">Our People</p>
          <h1 className="display mt-6 text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.98] text-white">
            Our <span className="font-serif italic text-[#7be0b4]">Team</span>
          </h1>
          <p className="lead mt-6 max-w-xl text-white/70">
            The people behind W Morgan Technologies. Select a profile to read more.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        {status === "loading" && <LoadingState label="Loading team" variant="cards" />}
        {status === "error" && <ErrorState message={errorMessage} />}
        {status === "empty" && (
          <EmptyState message="Our team profiles will be published here soon." />
        )}

        {status === "ready" &&
          sections.map((group) => (
            <div key={group.type} className="mb-14 last:mb-0">
              <h2 className="mono-label mb-6 text-[#0e1411]/50">{group.label}</h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.members.map((member, index) => (
                  <MemberCard key={member.id} member={member} index={index} />
                ))}
              </ul>
            </div>
          ))}
      </section>

      <FinalCTASection />
    </main>
  );
}
