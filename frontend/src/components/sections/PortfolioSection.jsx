import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { paths } from "../../routes/paths";
import { fetchPublicPortfolio } from "../../lib/api";
import { normalizeProject } from "../../lib/portfolioApi";
import { EmptyState, ErrorState, LoadingState } from "../common/DataState";
import Reveal from "../common/Reveal";

/** One project as a compact poster tile. Without a cover image it shows a branded tile, never stock art. */
function ProjectTile({ project, index }) {
  const tags = project.technologies?.slice(0, 2) || [];

  return (
    <Reveal as="li" y={16} delay={index * 0.06}>
      <Link
        to={paths.portfolio}
        className="group relative block aspect-[4/4.6] overflow-hidden rounded-2xl border border-white/10 bg-[#12261c]"
      >
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#23483a,#0d1b14_70%)]"
          >
            <span className="font-serif text-[6rem] italic leading-none text-white/10">
              {project.title.trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08120d] via-[#08120d]/35 to-transparent"
        />

        <div className="absolute inset-x-3.5 top-3.5 flex items-start justify-between">
          {project.category ? (
            <span className="rounded-full bg-[#7be0b4] px-2.5 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-[#0d1b14]">
              {project.category}
            </span>
          ) : (
            <span />
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0d1b14] opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight size={15} />
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 text-white">
          <div className="flex items-center gap-2">
            {project.logo && (
              <span className="flex h-7 min-w-7 max-w-[4.5rem] items-center justify-center rounded-md bg-white p-1">
                <img src={project.logo} alt="" className="h-full w-auto max-w-full object-contain" />
              </span>
            )}
            {project.clientName && (
              <p className="mono-label truncate text-[10px] text-[#7be0b4]">{project.clientName}</p>
            )}
          </div>
          <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight">{project.title}</h3>
          {tags.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <li key={tag} className="pill pill-dark !px-2 !py-0.5 !text-[10.5px] backdrop-blur-md">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

function PortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchPublicPortfolio()
      .then((items) => {
        if (!Array.isArray(items)) {
          throw new Error("The portfolio response was not a list.");
        }

        if (active) {
          const normalized = items.map(normalizeProject);
          setProjects(normalized);
          setStatus(normalized.length ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "Selected work could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Four projects at most on the Home page; the full set lives on /portfolio
  const shown = projects.slice(0, 4);

  return (
    <section className="surface-dark aurora on-dark relative z-10 -mt-6 rounded-t-[2rem] bg-[#0a1610] py-12 md:py-16">
      <span aria-hidden="true" className="grain-overlay" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow-light">Technology in Action</p>

            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-white">
              Systems &amp; Platforms <span className="text-[#ff3b30]">We&apos;ve Built.</span>
            </h2>
          </div>

          <Link to={paths.portfolio} className="btn btn-light !min-h-10 !pl-5 !text-[13px] self-start md:self-auto">
            View All Projects
            <span className="btn-arrow !h-7 !w-7" aria-hidden="true">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </Reveal>

        {status === "loading" && (
          <LoadingState label={"Loading selected work..."} variant="cards" dark />
        )}

        {status === "error" && <ErrorState message={errorMessage} dark />}

        {status === "empty" && (
          <EmptyState message={"No selected work is available right now."} dark />
        )}

        {status === "ready" && (
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {shown.map((project, index) => (
              <ProjectTile key={project.id || project.title} project={project} index={index} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
