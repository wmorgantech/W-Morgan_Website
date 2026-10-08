import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { fetchPublicPortfolio } from "../lib/api";
import { projectCover } from "../lib/projectImages";
import FinalCTASection from "../components/sections/FinalCTASection";
import { EmptyState, ErrorState, LoadingState } from "../components/common/DataState";

const ease = [0.22, 1, 0.36, 1];

const FILTERS = [
  "All",
  "Web Development",
  "Mobile Apps",
  "UI/UX",
  "E-Commerce",
  "Software",
];

const PAGE_SIZE = 8;

function getProjectUrl(project) {
  return project.projectUrl || project.url || project.liveUrl || project.websiteUrl || null;
}

function getProjectLogo(project) {
  return project.clientLogo || project.logo || project.logoUrl || null;
}

function getProjectImage(project) {
  return project.coverImage || project.image || project.imageUrl || project.thumbnail || null;
}

function getProjectCategory(project) {
  return project.category || project.service || project.type || "Software";
}

function getTechStack(project) {
  if (Array.isArray(project.technologies)) return project.technologies;
  if (Array.isArray(project.techStack)) return project.techStack;
  if (Array.isArray(project.tags)) return project.tags;
  return [];
}

function normalizeProject(project, index) {
  return {
    ...project,
    number: String(index + 1).padStart(2, "0"),
    name: project.name || project.title || project.projectName || "Untitled Project",
    category: getProjectCategory(project),
    logo: getProjectLogo(project),
    image: getProjectImage(project),
    technologies: getTechStack(project),
    url: getProjectUrl(project),
  };
}

/* =========================
   PROJECT LOGO
========================= */

function ProjectLogo({ project, className = "h-9 w-9" }) {
  if (project.logo) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#0e1411]/10 bg-white p-1.5 ${className}`}
      >
        <img src={project.logo} alt="" className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-[#0d1b14] font-mono text-[10px] font-medium tracking-tight text-[#7be0b4] ${className}`}
    >
      WM
    </div>
  );
}

/* =========================
   PROJECT CARD
========================= */

function ProjectCard({ project, index, featured, onOpen }) {
  const image = projectCover({ coverImage: project.image }, index);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project, index)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease }}
      aria-label={`View details: ${project.name}`}
      className={`group text-left ${featured ? "lg:col-span-2" : ""}`}
    >
      <div
        className={`frame frame-ring relative rounded-2xl ${
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <img src={image} alt="" loading="lazy" />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08120d]/80 via-[#08120d]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span className="rounded-full border border-white/20 bg-[#0d1b14]/60 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
            {project.category}
          </span>
          <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white text-[#0d1b14] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <span className="absolute bottom-4 left-4 font-mono text-xs text-white/80">
          {project.number}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <ProjectLogo project={project} />
        <div className="min-w-0">
          <h2 className="truncate text-[17px] font-semibold tracking-tight text-[#0e1411] transition-colors duration-200 group-hover:text-[#176b4d]">
            {project.name}
          </h2>
          {project.clientName && (
            <p className="mt-0.5 truncate text-xs text-[#5c655f]">{project.clientName}</p>
          )}
        </div>
      </div>

      {project.technologies?.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <li key={`${tech}-${techIndex}`} className="pill !text-[11px]">
              {tech}
            </li>
          ))}
        </ul>
      )}
    </motion.button>
  );
}

/* =========================
   PROJECT DETAIL DIALOG
========================= */

function ProjectDialog({ entry, onClose }) {
  const closeRef = useRef(null);
  const { project, index } = entry;
  const image = projectCover({ coverImage: project.image }, index);
  const body = project.description || project.summary;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#08120d]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease }}
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] sm:rounded-3xl md:grid-cols-[1.1fr_1fr] md:overflow-hidden"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0e1411] shadow-md transition-colors hover:bg-[#0d1b14] hover:text-white"
        >
          <X size={17} />
        </button>

        <div className="frame !rounded-none !border-0 aspect-[16/10] md:aspect-auto md:min-h-[460px]">
          <img src={image} alt="" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#08120d]/60 via-transparent to-transparent"
          />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#0d1b14]/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
            {project.category}
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8 md:overflow-y-auto">
          <div className="flex items-center gap-3">
            <ProjectLogo project={project} className="h-11 w-11" />
            <p className="mono-label text-[#176b4d]">
              {project.clientName || project.number}
            </p>
          </div>

          <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-[#0e1411] sm:text-[1.75rem]">
            {project.name}
          </h2>

          {body && <p className="mt-4 text-[14px] leading-7 text-[#5c655f]">{body}</p>}

          {project.technologies?.length > 0 && (
            <div className="mt-6">
              <p className="mono-label text-[#0e1411]/40">Technology</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <li key={`${tech}-${techIndex}`} className="pill">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2faa7d]" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.url && (
            <div className="mt-auto pt-8">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit project
                <span className="btn-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

/* =========================
   PORTFOLIO PAGE
========================= */

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const closeDialog = useCallback(() => setSelected(null), []);

  /* FETCH PORTFOLIO */
  useEffect(() => {
    let active = true;

    fetchPublicPortfolio()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Portfolio response was not a list.");
        }

        const mapped = data.map(normalizeProject);

        if (active) {
          setProjects(mapped);
          setStatus(mapped.length ? "ready" : "empty");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "Portfolio could not be loaded.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* FILTER + SEARCH */
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const categoryMatch =
        activeFilter === "All" ||
        project.category?.toLowerCase() === activeFilter.toLowerCase();

      const searchMatch =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        project.technologies?.some((tech) => String(tech).toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });
  }, [projects, search, activeFilter]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeFilter]);

  // A 2-column feature tile only when it keeps the 3-column grid free of gaps.
  const showFeatured =
    activeFilter === "All" && !search.trim() && (visibleProjects.length + 1) % 3 === 0;

  return (
    <main className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* ================= HEADER ================= */}
      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="eyebrow eyebrow-light"
              >
                Our Work
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="display mt-6 text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.98] text-white"
              >
                Portfolio
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease }}
                className="lead mt-5 max-w-md"
              >
                Selected digital products and technology solutions built by W Morgan Technologies.
              </motion.p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="h-12 w-full rounded-full border border-white/15 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#7be0b4] focus:bg-white/[0.1] focus:ring-2 focus:ring-[#7be0b4]/25"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS (sticky) ================= */}
      <section className="sticky top-[72px] z-30 border-b border-[#0e1411]/10 bg-[#f6f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "border-[#0d1b14] bg-[#0d1b14] text-white"
                    : "border-[#0e1411]/12 bg-white text-[#4b554f] hover:border-[#176b4d]/50 hover:text-[#0e1411]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= PROJECT GRID ================= */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        {status === "loading" && <LoadingState label={"Loading projects..."} variant="cards" />}
        {status === "error" && <ErrorState message={errorMessage} />}
        {status === "empty" && <EmptyState message={"No projects are available right now."} />}

        {status === "ready" && filteredProjects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#0e1411]/15 bg-white px-5 py-16 text-center">
            <p className="text-sm font-semibold">No matching projects</p>
            <p className="mt-1 text-xs text-[#5c655f]">Try another search or category.</p>
          </div>
        )}

        {status === "ready" && visibleProjects.length > 0 && (
          <>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || project.number}
                  project={project}
                  index={index}
                  featured={showFeatured && index === 0}
                  onOpen={(item, itemIndex) => setSelected({ project: item, index: itemIndex })}
                />
              ))}
            </div>

            {/* LOAD MORE */}
            {visibleCount < filteredProjects.length && (
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="btn btn-outline"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ================= CTA ================= */}
      <FinalCTASection />

      <AnimatePresence>
        {selected && (
          <ProjectDialog entry={selected} onClose={closeDialog} />
        )}
      </AnimatePresence>
    </main>
  );
}
