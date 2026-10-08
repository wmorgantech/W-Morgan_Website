import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const variants = {
  primary: "btn-primary",
  outline: "btn-outline",
  light: "btn-light",
  ghost: "btn-ghost-light",
  accent: "btn-accent",
};

function Button({
  children,
  href,
  variant = "primary",
  arrow = false,
  className = "",
  ...props
}) {
  const classes = `btn ${variants[variant] ?? variants.primary} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <span className="btn-arrow" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

export default Button;
