import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, Building2, Check, GraduationCap, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fetchPublicTeamMember } from "../lib/api";
import { normalizeMember } from "../lib/team";
import { usePageMeta } from "../hooks/usePageMeta";
import { paths } from "../routes/paths";
import Button from "../components/common/Button";
import { ErrorState } from "../components/common/DataState";
import MemberPhoto from "../components/team/MemberPhoto";

function Section({ title, children }) {
  return (
    <section className="border-t border-[#0e1411]/10 pt-7 first:border-t-0 first:pt-0">
      <h2 className="mono-label text-[#0e1411]/50">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[14px] leading-7 text-[#3d453f]">
          <Check size={15} className="mt-1.5 shrink-0 text-[#2faa7d]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProfileSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-8 lg:grid-cols-12">
      <span className="sr-only">Loading profile</span>
      <div className="h-96 animate-pulse rounded-2xl bg-[#101512]/[0.07] lg:col-span-4" />
      <div className="space-y-4 lg:col-span-8">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="h-20 animate-pulse rounded-2xl bg-[#101512]/[0.07]" />
        ))}
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
      <h1 className="display text-[clamp(1.75rem,3.4vw,2.5rem)]">Profile not found</h1>
      <p className="lead mt-4">
        This profile does not exist or is not currently published.
      </p>
      <div className="mt-8">
        <Button href={paths.team} arrow>
          View our team
        </Button>
      </div>
    </div>
  );
}

export default function TeamProfile() {
  const { id } = useParams();
  const [state, setState] = useState({ id: null, status: "loading", member: null, message: "" });

  // The result is tied to the id it was fetched for, so switching profiles shows the
  // loading state instead of briefly displaying the previous person.
  const current = state.id === id ? state : { status: "loading", member: null, message: "" };
  const { member } = current;

  usePageMeta({
    title: member ? member.name : "Team profile",
    description: member
      ? `${member.name}, ${member.designation} at W Morgan Technologies.`
      : "Team profile at W Morgan Technologies.",
    noindex: current.status === "notfound",
  });

  useEffect(() => {
    let active = true;

    if (!/^[1-9]\d*$/.test(id || "")) {
      Promise.resolve().then(() => active && setState({ id, status: "notfound", member: null, message: "" }));
      return () => {
        active = false;
      };
    }

    fetchPublicTeamMember(id)
      .then((record) => {
        if (active) setState({ id, status: "ready", member: normalizeMember(record), message: "" });
      })
      .catch((error) => {
        if (!active) return;
        const missing = error.status === 404 || error.status === 400;
        setState({
          id,
          status: missing ? "notfound" : "error",
          member: null,
          message: error.message || "The profile could not be loaded.",
        });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const hasDetails =
    member &&
    (member.summary ||
      member.experience ||
      member.responsibilities.length ||
      member.skillGroups.length ||
      member.education.length ||
      member.strengths.length ||
      member.projects.length);

  return (
    <main className="bg-[#f6f6f1] text-[#0e1411]">
      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
          <Link
            to={paths.team}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Our Team
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14 lg:px-12">
        {current.status === "loading" && <ProfileSkeleton />}
        {current.status === "error" && <ErrorState message={current.message} />}
        {current.status === "notfound" && <NotFoundState />}

        {current.status === "ready" && member && (
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* IDENTITY */}
            <aside className="surface-dark on-dark overflow-hidden rounded-2xl lg:sticky lg:top-24 lg:col-span-4">
              <MemberPhoto member={member} className="aspect-[4/5] w-full" textClassName="text-8xl" />
              <div className="p-6">
                <h1 className="text-2xl font-semibold tracking-tight text-white">{member.name}</h1>
                <p className="mt-1.5 text-[14px] text-[#7be0b4]">{member.designation}</p>

                {(member.department || member.location) && (
                  <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-[13px] text-white/70">
                    {member.department && (
                      <li className="flex items-center gap-2.5">
                        <Building2 size={14} className="shrink-0 text-[#7be0b4]" aria-hidden="true" />
                        {member.department}
                      </li>
                    )}
                    {member.location && (
                      <li className="flex items-center gap-2.5">
                        <MapPin size={14} className="shrink-0 text-[#7be0b4]" aria-hidden="true" />
                        {member.location}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </aside>

            {/* DETAILS */}
            <div className="space-y-7 rounded-2xl border border-[#0e1411]/10 bg-white p-6 sm:p-8 lg:col-span-8">
              {!hasDetails && (
                <p className="text-[14px] text-[#5c655f]">
                  More details about {member.name} will be added soon.
                </p>
              )}

              {member.summary && (
                <Section title="Professional summary">
                  <p className="whitespace-pre-line text-[15px] leading-7 text-[#3d453f]">
                    {member.summary}
                  </p>
                </Section>
              )}

              {member.experience && (
                <Section title="Experience">
                  <p className="flex items-start gap-3 text-[15px] leading-7 text-[#3d453f]">
                    <Briefcase size={16} className="mt-1.5 shrink-0 text-[#176b4d]" aria-hidden="true" />
                    {member.experience}
                  </p>
                </Section>
              )}

              {member.responsibilities.length > 0 && (
                <Section title="Responsibilities">
                  <BulletList items={member.responsibilities} />
                </Section>
              )}

              {member.skillGroups.length > 0 && (
                <Section title="Technical skills">
                  <div className="space-y-4">
                    {member.skillGroups.map((group) => (
                      <div key={group.category}>
                        <p className="text-[13px] font-semibold text-[#0e1411]">{group.category}</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {group.items.map((skill) => (
                            <li key={skill} className="pill">
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {member.education.length > 0 && (
                <Section title="Education">
                  <ul className="space-y-2.5">
                    {member.education.map((entry) => (
                      <li key={entry} className="flex gap-3 text-[14px] leading-7 text-[#3d453f]">
                        <GraduationCap size={16} className="mt-1.5 shrink-0 text-[#176b4d]" aria-hidden="true" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {member.strengths.length > 0 && (
                <Section title="Key strengths">
                  <BulletList items={member.strengths} />
                </Section>
              )}

              {member.projects.length > 0 && (
                <Section title="Projects">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {member.projects.map((project) => (
                      <li
                        key={project.title}
                        className="rounded-xl border border-[#0e1411]/10 bg-[#f6f6f1] p-4"
                      >
                        <p className="text-[14px] font-semibold text-[#0e1411]">{project.title}</p>
                        {project.description && (
                          <p className="mt-1.5 text-[13px] leading-6 text-[#5c655f]">
                            {project.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
