import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollProgressBar from "../components/common/ScrollProgressBar";

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  // Every route starts at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // One delegated listener feeds the pointer-spotlight effect (.spot cards)
  useEffect(() => {
    // Skip on touch devices (and in environments without matchMedia)
    if (typeof window.matchMedia !== "function" || window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }
    const onMove = (event) => {
      const card = event.target instanceof Element ? event.target.closest(".spot") : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[#0e1411] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <ScrollProgressBar />
      <Navbar />

      <motion.main
        id="main-content"
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}
