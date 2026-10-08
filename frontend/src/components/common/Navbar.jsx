import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { paths } from "../../routes/paths";
import logoMark from "../../assets/logo (2).png";
import { usePublicSiteSettings } from "../../hooks/usePublicSiteSettings";
import Button from "./Button";

const navItems = [
  { label: "Home", path: paths.home },
  { label: "About", path: paths.about },
  { label: "Services", path: paths.services },
  { label: "Products", path: paths.products },
  { label: "Portfolio", path: paths.portfolio },
  { label: "Careers", path: paths.career },
  { label: "Contact", path: paths.contact },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { settings } = usePublicSiteSettings();
  const logo = settings.logoUrl && !logoLoadFailed ? settings.logoUrl : logoMark;

  const location = useLocation();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [settings.logoUrl]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b text-[#0e1411] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || mobileOpen
          ? "border-[#0e1411]/10 bg-[#f6f6f1]/90 shadow-[0_10px_30px_-22px_rgba(8,18,13,0.5)]"
          : "border-transparent bg-[#f6f6f1]/70"
      }`}
    >
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
        {/* LOGO */}
        <Link
          to="/"
          aria-label="W Morgan Technologies home"
          className="group flex w-fit items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2faa7d]/50 focus-visible:ring-offset-2"
        >
          <img
            src={logo}
            alt="W Morgan Technologies"
            onError={() => setLogoLoadFailed(true)}
            className="h-10 w-10 object-contain transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105"
          />

          <span className="leading-none">
            <strong className="block text-[15px] font-bold tracking-tight">W MORGAN</strong>
            <small className="mt-1 block font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-[#5c655f]">
              Technologies
            </small>
          </span>
        </Link>

        {/* DESKTOP NAV: floating capsule with a sliding active pill */}
        <nav
          className="hidden items-center gap-0.5 rounded-full border border-[#0e1411]/10 bg-white/80 p-1 shadow-[0_6px_22px_-14px_rgba(8,18,13,0.45)] lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2faa7d]/60 ${
                  active ? "text-white" : "text-[#4b554f] hover:text-[#0e1411]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-[#0d1b14]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden sm:block">
            <Button href={paths.contact} arrow>
              Get in Touch
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e1411]/15 bg-white text-[#0e1411] transition-colors duration-200 hover:bg-[#0e1411] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2faa7d]/60 lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-[#f6f6f1] lg:hidden"
          >
            <nav
              className="mx-auto flex min-h-full max-w-7xl flex-col px-5 pb-8 pt-3 sm:px-8"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => {
                const active = isActive(item.path);

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + index * 0.035, duration: 0.35 }}
                  >
                    <Link
                      to={item.path}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline justify-between border-b border-[#0e1411]/10 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2faa7d]/60"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[11px] text-[#176b4d]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-[1.65rem] font-semibold tracking-tight ${
                            active
                              ? "font-serif font-normal italic text-[#176b4d]"
                              : "text-[#0e1411]"
                          }`}
                        >
                          {item.label}
                        </span>
                      </span>
                      {active && <span className="h-2 w-2 rounded-full bg-[#ff3b30]" />}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-8 sm:hidden">
                <Button href={paths.contact} arrow className="w-full justify-between">
                  Get in Touch
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
