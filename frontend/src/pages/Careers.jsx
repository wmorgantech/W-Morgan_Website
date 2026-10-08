import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  X,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  fetchPublicCareerOpenings,
  submitJobApplication,
} from "../lib/api";
import careerVisual from "../assets/img10.jpeg";
import { LoadingState } from "../components/common/DataState";

const ease = [0.22, 1, 0.36, 1];

const fieldClass =
  "block w-full rounded-xl border border-[#0e1411]/15 bg-white px-4 py-3 text-sm text-[#0e1411] outline-none transition placeholder:text-[#0e1411]/35 hover:border-[#0e1411]/30 focus:border-[#176b4d] focus:ring-4 focus:ring-[#2faa7d]/15";

const labelClass = "mb-2 block text-[13px] font-medium text-[#0e1411]";

function humanize(value) {
  return String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Careers() {
  const [jobList, setJobList] = useState([]);
  const [openingsStatus, setOpeningsStatus] = useState("loading");
  const [openingsError, setOpeningsError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resumeUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dialogRef = useRef(null);
  const applyButtonRef = useRef(null);

  /* =========================
     FETCH CAREER OPENINGS
  ========================= */

  useEffect(() => {
    let active = true;

    fetchPublicCareerOpenings()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(
            "The career openings response was not a list."
          );
        }

        if (active) {
          setJobList(data);
          setOpeningsStatus(
            data.length ? "ready" : "empty"
          );
        }
      })
      .catch((error) => {
        if (active) {
          setOpeningsError(
            error.message ||
              "Career openings could not be loaded."
          );
          setOpeningsStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* =========================
     MODAL FOCUS
  ========================= */

  useEffect(() => {
    if (selectedJob) {
      dialogRef.current
        ?.querySelector("input")
        ?.focus();
    } else {
      applyButtonRef.current?.focus();
      applyButtonRef.current = null;
    }
  }, [selectedJob]);

  /* =========================
     APPLY
  ========================= */

  const handleApply = async (event) => {
    event.preventDefault();

    if (!selectedJob) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await submitJobApplication({
        jobOpeningId: Number(selectedJob.id),
        candidateName:
          formData.candidateName.trim(),
        email: formData.email.trim(),
        phone:
          formData.phone.trim() || undefined,
        coverLetter:
          formData.coverLetter.trim() || undefined,
        resumeUrl:
          formData.resumeUrl.trim() || undefined,
      });

      if (response && response.id) {
        setSubmitted(true);
      } else {
        throw new Error(
          "Application could not be saved."
        );
      }
    } catch (error) {
      setErrorMsg(
        error.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    setSelectedJob(null);
    setSubmitted(false);
    setErrorMsg("");

    setFormData({
      candidateName: "",
      email: "",
      phone: "",
      coverLetter: "",
      resumeUrl: "",
    });
  };

  /* =========================
     KEYBOARD ACCESSIBILITY
  ========================= */

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable =
      dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    if (!focusable?.length) return;

    const first = focusable[0];
    const last =
      focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <main className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-[#0e1411]/10 bg-[#e6f0ea]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            {/* HERO CONTENT */}

            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="eyebrow"
              >
                Join Our Team
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="display mt-6 max-w-3xl text-[clamp(2.4rem,5vw,4.1rem)] leading-[1] text-[#0e1411]"
              >
                Build your career with
                <br />
                <span className="text-[#ff3b30]">W Morgan Technologies.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14, ease }}
                className="lead mt-6 max-w-lg"
              >
                We are building digital products that matter. Join an engineering environment
                focused on quality code, scalable systems, and continuous growth.
              </motion.p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {["Engineering", "Growth", "Innovation"].map((item) => (
                  <li key={item} className="pill pill-solid !px-4 !py-1.5 !text-xs">
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#openings" className="btn btn-primary mt-8">
                View Open Positions
                <span className="btn-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </div>

            {/* HERO IMAGE */}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -left-3 h-full w-full rounded-[1.5rem] border border-[#176b4d]/30"
              />
              <div className="frame frame-ring relative aspect-[4/3] rounded-[1.5rem] shadow-[0_40px_80px_-40px_rgba(8,18,13,0.6)]">
                <img src={careerVisual} alt="W Morgan Technologies workspace" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08120d]/75 via-[#08120d]/10 to-transparent"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-white/15 bg-[#0d1b14]/65 px-4 py-2.5 backdrop-blur-md">
                  <span className="mono-label text-white/80">Engineering Culture</span>
                  <span className="mono-label text-[#7be0b4]">Open Positions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OPEN POSITIONS
      ================================================== */}

      <section id="openings" className="scroll-mt-24 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* SECTION HEADER */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Opportunities</p>

              <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,2.9rem)]">
                Open <span className="text-[#ff3b30]">Positions</span>
                {(openingsStatus === "ready" || openingsStatus === "empty") && (
                  <span className="ml-3 align-middle font-mono text-base font-medium text-[#0e1411]/40">
                    ({jobList.length})
                  </span>
                )}
              </h2>
            </div>

            <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#0e1411]/12 bg-white px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#176b4d] sm:self-auto">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  openingsStatus === "ready"
                    ? "bg-[#2faa7d] shadow-[0_0_0_3px_rgba(47,170,125,0.2)]"
                    : "bg-[#0e1411]/30"
                }`}
              />
              {openingsStatus === "ready"
                ? "Active Hiring"
                : openingsStatus === "loading"
                  ? "Checking Openings"
                  : openingsStatus === "error"
                    ? "Unavailable"
                    : "No Openings"}
            </span>
          </div>

          {/* LOADING */}

          {openingsStatus === "loading" && <LoadingState label={"Loading open positions..."} variant="rows" />}

          {/* ERROR */}

          {openingsStatus === "error" && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-[#c5221f]/20 bg-[#c5221f]/[0.04] px-5 py-5"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#c5221f]" />
              <p className="text-sm text-[#0e1411]">{openingsError}</p>
            </div>
          )}

          {/* EMPTY */}

          {openingsStatus === "empty" && (
            <div className="rounded-2xl border border-dashed border-[#0e1411]/15 bg-white px-5 py-14 text-center">
              <p className="text-base font-semibold text-[#0e1411]">
                No open positions right now.
              </p>

              <p className="mt-1.5 text-sm text-[#5c655f]">
                Please check back later for new opportunities.
              </p>
            </div>
          )}

          {/* JOB LIST */}

          {openingsStatus === "ready" && (
            <ul className="grid gap-4">
              {jobList.map((job, index) => (
                <motion.li
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease }}
                >
                  <article className="spot group rounded-2xl border border-[#0e1411]/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176b4d]/40 hover:shadow-[0_24px_50px_-30px_rgba(8,18,13,0.5)] sm:p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
                      {/* JOB DETAILS */}

                      <div className="min-w-0 flex-1">
                        {/* META */}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5c655f]">
                          <span className="pill pill-solid !py-1 !text-[11px]">
                            {job.department || "Engineering"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#176b4d]" />
                            {job.location || "Tamil Nadu"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={13} className="text-[#176b4d]" />
                            {humanize(job.employmentType || "FULL_TIME")}
                          </span>

                          {job.experience && (
                            <span className="inline-flex items-center rounded-full bg-[#f6f6f1] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#0e1411]">
                              Exp: {job.experience}
                            </span>
                          )}
                        </div>

                        {/* TITLE */}

                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#0e1411] transition-colors duration-200 group-hover:text-[#176b4d] sm:text-[1.4rem]">
                          {job.jobTitle}
                        </h3>

                        {/* DESCRIPTION */}

                        {job.description && (
                          <p className="mt-2 line-clamp-2 max-w-3xl text-[14px] leading-7 text-[#5c655f]">
                            {job.description}
                          </p>
                        )}

                        {/* SKILLS */}

                        {job.skills?.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-1.5">
                            {job.skills.map((skill) => (
                              <li key={skill} className="pill !text-[11px]">
                                {skill}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* APPLY */}

                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={(event) => {
                            applyButtonRef.current = event.currentTarget;

                            setSelectedJob(job);
                            setSubmitted(false);
                            setErrorMsg("");
                          }}
                          className="btn btn-primary w-full md:w-auto"
                        >
                          Apply Now
                          <span className="btn-arrow" aria-hidden="true">
                            <ArrowUpRight size={16} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ==================================================
          APPLICATION MODAL
      ================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#08120d]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-dialog-title"
            onKeyDown={handleDialogKeyDown}
            className="relative max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-[#0e1411]/10 bg-white shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] sm:max-h-[calc(100vh-2rem)] sm:rounded-3xl"
          >
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0e1411]/10 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
              <div className="min-w-0 pr-4">
                <p className="mono-label text-[#176b4d]">Application</p>

                <h3
                  id="application-dialog-title"
                  className="mt-1 truncate text-lg font-semibold tracking-tight text-[#0e1411] sm:text-xl"
                >
                  Apply for {selectedJob.jobTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close application dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0e1411]/12 text-[#4b554f] transition-colors hover:bg-[#0d1b14] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            {/* SUCCESS */}

            {submitted ? (
              <div role="status" className="px-6 py-12 text-center sm:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f0ea]">
                  <CheckCircle2 size={28} className="text-[#2faa7d]" />
                </div>

                <h4 className="mt-5 text-xl font-semibold tracking-tight text-[#0e1411]">
                  Application Received!
                </h4>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#5c655f]">
                  Thank you for applying for {selectedJob.jobTitle}. Our team will review your
                  application and contact you soon.
                </p>

                <button type="button" onClick={closeModal} className="btn btn-primary mt-7">
                  Close
                </button>
              </div>
            ) : (
              /* FORM */

              <form onSubmit={handleApply} className="grid gap-5 px-6 py-6 sm:px-8">
                {/* ERROR */}

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>
                )}

                {/* NAME */}

                <div>
                  <label htmlFor="application-name" className={labelClass}>
                    Full Name *
                  </label>

                  <input
                    id="application-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.candidateName}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        candidateName: event.target.value,
                      })
                    }
                    className={fieldClass}
                    placeholder="Enter your name"
                  />
                </div>

                {/* EMAIL + PHONE */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="application-email" className={labelClass}>
                      Email Address *
                    </label>

                    <input
                      id="application-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          email: event.target.value,
                        })
                      }
                      className={fieldClass}
                      placeholder="name@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="application-phone" className={labelClass}>
                      Phone Number
                    </label>

                    <input
                      id="application-phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          phone: event.target.value,
                        })
                      }
                      className={fieldClass}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* RESUME */}

                <div>
                  <label htmlFor="application-resume" className={labelClass}>
                    Resume Link / URL
                  </label>

                  <input
                    id="application-resume"
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        resumeUrl: event.target.value,
                      })
                    }
                    className={fieldClass}
                    placeholder="Google Drive / LinkedIn / Portfolio"
                  />
                </div>

                {/* COVER NOTE */}

                <div>
                  <label htmlFor="application-cover-letter" className={labelClass}>
                    Brief Cover Note
                  </label>

                  <textarea
                    id="application-cover-letter"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        coverLetter: event.target.value,
                      })
                    }
                    className={`${fieldClass} resize-none`}
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-[#0e1411]/10 pt-5 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeModal} className="btn btn-outline">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                    <span className="btn-arrow" aria-hidden="true">
                      <Send size={14} />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
