import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/**
 * Fades and lifts its children into view once as they scroll on screen.
 * Honours reduced motion through the MotionConfig in MainLayout.
 */
export default function Reveal({ as = "div", delay = 0, y = 26, className = "", children, ...rest }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
