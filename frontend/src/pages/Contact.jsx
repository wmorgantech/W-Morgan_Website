import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { submitContactInquiry } from "../lib/api";
import { usePublicSiteSettings } from "../hooks/usePublicSiteSettings";

const ease = [0.22, 1, 0.36, 1];

const serviceOptions = [
  "Software Development",
  "Mobile Development",
  "AI & Automation",
  "Cloud & DevOps",
  "UI/UX & Product Design",
  "Digital Transformation",
  "Other",
];

const OFFICE_ADDRESS =
  "DNo - 333-F2, Geetha Building, Nehru St, Peranaidu Layout, Ram Nagar, Coimbatore, Tamil Nadu 641009";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=DNo%20333-F2%2C%20Geetha%20Building%2C%20Nehru%20St%2C%20Peranaidu%20Layout%2C%20Ram%20Nagar%2C%20Coimbatore%2C%20Tamil%20Nadu%20641009";

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=DNo%20333-F2%2C%20Geetha%20Building%2C%20Nehru%20St%2C%20Peranaidu%20Layout%2C%20Ram%20Nagar%2C%20Coimbatore%2C%20Tamil%20Nadu%20641009&output=embed";

const fieldClass =
  "block w-full rounded-xl border border-[#0e1411]/15 bg-white px-4 py-3 text-sm text-[#0e1411] outline-none transition placeholder:text-[#0e1411]/35 hover:border-[#0e1411]/30 focus:border-[#176b4d] focus:ring-4 focus:ring-[#2faa7d]/15";

const labelClass = "mb-2 block text-[13px] font-medium text-[#0e1411]";

export default function Contact() {
  const {
    settings: publicSettings,
    error: settingsError,
  } = usePublicSiteSettings();

  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: publicSettings.contactEmail,
      href: publicSettings.contactEmail
        ? `mailto:${publicSettings.contactEmail}`
        : undefined,
    },
    {
      icon: Phone,
      label: "Phone",
      value: publicSettings.contactPhone,
      href: publicSettings.contactPhone
        ? `tel:${publicSettings.contactPhone.replace(/[^\d+]/g, "")}`
        : undefined,
    },
    {
      icon: Clock3,
      label: "Working Hours",
      value: publicSettings.workingHours,
    },
  ].filter(({ value }) => value);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Software Development",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        service: formData.service,
        message: formData.message.trim(),
      });

      if (res && res.id) {
        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "Software Development",
          message: "",
        });
      } else {
        throw new Error("Message could not be saved.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[#f6f6f1] text-[#0e1411]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="surface-dark on-dark">
        <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:px-8 md:pb-32 md:pt-20 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
                className="eyebrow eyebrow-light"
              >
                Get In Touch
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="display mt-6 text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.98] text-white"
              >
                Let's build
                <br />
                something <span className="text-[#ff3b30]">useful.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease }}
              className="lead max-w-md border-l border-[#7be0b4]/40 pl-5"
            >
              Have an idea, a business challenge or a digital product in mind? Tell us what you're
              building and we'll explore how technology can move it forward.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTACT CONTENT
      ================================================== */}

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* ==================================================
                LEFT: CONTACT INFORMATION
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease }}
              className="order-2 pt-0 lg:order-1 lg:pt-12"
            >
              <p className="eyebrow">Contact Details</p>

              <h2 className="display mt-5 text-[clamp(1.75rem,3vw,2.4rem)]">
                Let's <span className="text-[#ff3b30]">talk.</span>
              </h2>

              <p className="lead mt-3 max-w-sm">
                Reach out directly or send us your project requirements.
              </p>

              {settingsError && (
                <p role="status" className="mt-3 text-xs leading-relaxed text-[#5c655f]">
                  {settingsError}
                </p>
              )}

              {/* CONTACT ITEMS */}

              <ul className="mt-8 divide-y divide-[#0e1411]/10 border-y border-[#0e1411]/10">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label} className="group flex items-center gap-4 py-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#0e1411]/10 bg-white text-[#176b4d] transition-colors duration-300 group-hover:border-[#0d1b14] group-hover:bg-[#0d1b14] group-hover:text-[#7be0b4]">
                        <Icon size={17} strokeWidth={1.7} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="mono-label text-[#0e1411]/45">{item.label}</p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-0.5 block break-all text-[15px] font-semibold text-[#0e1411] transition-colors hover:text-[#176b4d]"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-[15px] font-semibold text-[#0e1411]">
                            {item.value}
                          </p>
                        )}
                      </div>

                      {item.href && (
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-[#0e1411]/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-[#176b4d]"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* ==================================================
                  OFFICE LOCATION + MAP
              ================================================== */}

              <div className="mt-8 overflow-hidden rounded-2xl border border-[#0e1411]/10 bg-white shadow-[0_20px_44px_-30px_rgba(8,18,13,0.4)]">
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d1b14] text-[#7be0b4]">
                    <MapPin size={17} strokeWidth={1.7} />
                  </span>

                  <div className="min-w-0">
                    <p className="mono-label text-[#0e1411]/45">Office Location</p>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#0e1411]">
                      {OFFICE_ADDRESS}
                    </p>
                  </div>
                </div>

                {/* GOOGLE MAP */}

                <div className="relative border-y border-[#0e1411]/10 bg-[#e8e8e2]">
                  <iframe
                    title="W Morgan Technologies Office Location"
                    src={MAP_EMBED_URL}
                    className="h-[200px] w-full border-0 grayscale-[20%] transition-all duration-500 hover:grayscale-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  <div className="pointer-events-none absolute left-3 top-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2faa7d]" />
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#0e1411]">
                        Coimbatore Office
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5c655f]">
                    <MapPin size={12} />
                    Coimbatore, Tamil Nadu
                  </div>

                  <a
                    href={MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-arrow !text-xs"
                  >
                    View Map
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              {/* SUPPORT NOTE */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#e6f0ea] p-4">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2faa7d] shadow-[0_0_0_4px_rgba(47,170,125,0.2)]" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0e1411]">
                    Direct Technical Support
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#4b554f]">
                    Response timeframe within 24 business hours.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ==================================================
                RIGHT: CONTACT FORM (overlaps the hero)
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease }}
              className="relative order-1 -mt-20 rounded-[1.75rem] border border-[#0e1411]/10 bg-white p-6 shadow-[0_40px_90px_-40px_rgba(8,18,13,0.55)] sm:p-9 md:-mt-24 lg:order-2"
            >
              <p className="eyebrow">Start a Conversation</p>

              <h2 className="display mt-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
                Send a <span className="text-[#ff3b30]">Message</span>
              </h2>

              <p className="lead mt-2 max-w-lg">
                Fill out the details below and our engineering team will get back to you.
              </p>

              {/* ==================================================
                  SUCCESS MESSAGE
              ================================================== */}

              {submitted ? (
                <div
                  role="status"
                  className="mt-8 rounded-2xl border border-[#2faa7d]/30 bg-[#e6f0ea] p-8 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <CheckCircle2 size={26} className="text-[#2faa7d]" />
                  </div>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#0e1411]">
                    Message Sent Successfully!
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#4b554f]">
                    Thank you for reaching out to W Morgan Technologies. We will contact you
                    shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* ==================================================
                   FORM
                ================================================== */

                <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
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

                  {/* NAME + EMAIL */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={fieldClass}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={fieldClass}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* PHONE + COMPANY */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className={labelClass}>
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={fieldClass}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-company" className={labelClass}>
                        Company / Organization
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={fieldClass}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  {/* SERVICE */}

                  <div>
                    <label htmlFor="contact-service" className={labelClass}>
                      Service Required
                    </label>

                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className={`${fieldClass} cursor-pointer`}
                    >
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MESSAGE */}

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      Project Details / Message *
                    </label>

                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`${fieldClass} resize-none`}
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>

                  {/* SUBMIT */}

                  <div className="border-t border-[#0e1411]/10 pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Sending Inquiry..." : "Submit Inquiry"}
                      <span className="btn-arrow" aria-hidden="true">
                        <Send size={14} />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          BOTTOM CTA STRIP
      ================================================== */}

      <section className="surface-dark on-dark">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div>
            <p className="mono-label text-[#7be0b4]">W Morgan Technologies</p>

            <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] text-white">
              Have something <span className="text-[#ff3b30]">worth building?</span>
            </h2>
          </div>

          <p className="lead max-w-sm md:text-right">
            Share your idea, requirement or challenge. Let's turn it into a practical digital
            solution.
          </p>
        </div>
      </section>
    </main>
  );
}
