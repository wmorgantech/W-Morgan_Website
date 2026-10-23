import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** A framed image that drifts slightly slower than the page as it scrolls past. */
export default function ParallaxImage({ src, alt = "", className = "", overlay = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08120d]/45 via-transparent to-transparent"
        />
      )}
    </div>
  );
}
