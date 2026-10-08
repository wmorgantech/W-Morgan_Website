import { motion, useScroll, useSpring } from "framer-motion";

/** 2px reading-progress line pinned to the top of the viewport. */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden="true">
      <motion.div className="h-full origin-left bg-[#ff3b30]" style={{ scaleX }} />
    </div>
  );
}

export default ScrollProgressBar;
