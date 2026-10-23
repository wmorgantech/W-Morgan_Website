/**
 * Endless horizontal ticker. The children are rendered twice and the track slides by
 * half its width, so the loop is seamless. Pauses on hover; static for reduced motion.
 */
export default function Marquee({ children, reverse = false, speed = 42, className = "", ...rest }) {
  return (
    <div className={`overflow-hidden ${className}`} {...rest}>
      <div
        className={`ticker ${reverse ? "ticker-reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
