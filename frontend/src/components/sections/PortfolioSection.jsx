import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { paths } from "../../routes/paths";
import {
  fetchFeaturedPortfolio,
  normalizeProject,
} from "../../lib/portfolioApi";
import { projectCover } from "../../lib/projectImages";
import { EmptyState, ErrorState, LoadingState } from "../common/DataState";

const ease = [0.22, 1, 0.36, 1];

function ProjectTile({ project, index, large }) {
  const image = projectCover(project, index);
  const tags = project.tags.slice(0, large ? 4 : 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease }}
      className={large ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}
    >
      <Link
        to={paths.portfolio}
        className={`group frame frame-ring relative block h-full rounded-2xl ${
          large ? "min-h-[360px] lg:min-h-[520px]" : "min-h-[250px]"
        }`}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* readability gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08120d] via-[#08120d]/35 to-[#08120d]/5 transition-opacity duration-500 group-hover:from-[#08120d]/95"
        />

        {/* top row */}
        <div className="absolute inset-x-5 top-5 flex items-start justify-between">
          <span className="rounded-full border border-white/20 bg-[#0d1b14]/55 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
            {project.number}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0d1b14] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>

        {/* content */}
        <div className="absolute inset-x-5 bottom-5 text-white">
          <p className="mono-label text-[#7be0b4]">
            {project.clientName || project.category || "Case Study"}
          </p>
          <h3
            className={`mt-2 font-semibold tracking-tight ${
              large ? "text-2xl md:text-[1.9rem]" : "text-lg md:text-xl"
            }`}
          >
            {project.title}
          </h3>

          <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="mt-2 max-w-md text-[13px] leading-6 text-white/70">
                {project.description}
              </p>
            </div>
          </div>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="pill pill-dark !py-1 !text-[11px] backdrop-blur-md">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.div>
  );
}

function PortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchFeaturedPortfolio()
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

  const shown = projects.slice(0, 3);
  const hasLarge = shown.length === 3;

  return (
    <section className="surface-dark on-dark py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow-light">Selected Work</p>

            <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)] text-white">
              Systems &amp; Platforms{" "}
              <span className="text-[#176b4d]">We've Built.</span>
            </h2>
          </div>

          <Link
            to={paths.portfolio}
            className="link-arrow self-start !border-white/25 text-white hover:!border-[#7be0b4] hover:!text-[#7be0b4] md:self-auto"
          >
            View all projects
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {status === "loading" && (
          <LoadingState label={"Loading selected work..."} variant="cards" dark />
        )}

        {status === "error" && <ErrorState message={errorMessage} dark />}

        {status === "empty" && (
          <EmptyState message={"No selected work is available right now."} dark />
        )}

        {status === "ready" && (
          <div
            className={`grid gap-4 ${
              hasLarge ? "lg:grid-cols-12" : shown.length === 2 ? "md:grid-cols-2" : ""
            }`}
          >
            {shown.map((project, index) => (
              <ProjectTile
                key={project.id || project.title}
                project={project}
                index={index}
                large={hasLarge && index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
